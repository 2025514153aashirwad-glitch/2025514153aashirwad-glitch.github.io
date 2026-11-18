# T2 · Glass desk. A Build Record card slides in from the right, passes behind the bevelled glass of the Commons window
# (real refraction through the glass edge) and settles into the record slot. Textures come from the studio kit (Geist only).
# blender -b -P glass_desk.py -- --out out/#### --anim 360 --samples 128 --res 1920x1080 --gpu [--frame 200]
import bpy, math, sys, os, argparse
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ap = argparse.ArgumentParser(); ap.add_argument('--out', default='out/####'); ap.add_argument('--anim', type=int, default=360); ap.add_argument('--samples', type=int, default=128)
ap.add_argument('--res', default='1920x1080'); ap.add_argument('--gpu', action='store_true'); ap.add_argument('--frame', type=int, default=0); ap.add_argument('--tex', default='tex')
A = ap.parse_args(argv)
bpy.ops.wm.read_factory_settings(use_empty=True); S = bpy.context.scene; TEX = os.path.abspath(A.tex)

def mat(name): m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear(); return m, nt.nodes, nt.links
def image_mat(name, file, strength=1.0, alpha=True):
    m, N, L = mat(name); out = N.new('ShaderNodeOutputMaterial'); tx = N.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(os.path.join(TEX, file)); tx.interpolation = 'Cubic'
    em = N.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = strength; L.new(tx.outputs['Color'], em.inputs['Color'])
    if alpha:
        tr = N.new('ShaderNodeBsdfTransparent'); mx = N.new('ShaderNodeMixShader'); k = N.new('ShaderNodeMath'); k.operation = 'MULTIPLY'; k.use_clamp = True; k.inputs[1].default_value = alpha if isinstance(alpha, float) else 1.0
        L.new(tx.outputs['Alpha'], k.inputs[0]); L.new(k.outputs[0], mx.inputs['Fac']); L.new(tr.outputs[0], mx.inputs[1]); L.new(em.outputs[0], mx.inputs[2]); L.new(mx.outputs[0], out.inputs['Surface'])
    else: L.new(em.outputs[0], out.inputs['Surface'])
    return m
def plane(name, w, h, loc, m):  # a vertical plane facing the camera (-Y)
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc); o = bpy.context.object; o.name = name; o.scale = (w, h, 1); o.rotation_euler = (math.radians(90), 0, 0)
    o.data.materials.append(m); o.visible_shadow = False; return o

# the desktop field far behind, the Commons face, the glass slab in front of it
plane('Field', 3.84 * 1.6, 2.16 * 1.6, (0, .9, 0), image_mat('Field', 'field.jpg', 1.0, alpha=False))
CX, CZ, CW, CH = -.35, .05, 1.65, 1.05
plane('Commons face', CW, CH, (CX, .06, CZ), image_mat('Commons', 'commons.webp', 1.0))
bpy.ops.mesh.primitive_cube_add(size=1, location=(CX, 0, CZ)); g = bpy.context.object; g.name = 'Glass'; g.scale = (CW + .03, .05, CH + .03)
bv = g.modifiers.new('Bevel', 'BEVEL'); bv.width = .028; bv.segments = 12; bv.limit_method = 'NONE'; bpy.ops.object.shade_smooth()
gm, N, L = mat('Glass'); out = N.new('ShaderNodeOutputMaterial'); b = N.new('ShaderNodeBsdfPrincipled'); L.new(b.outputs[0], out.inputs['Surface'])
b.inputs['Base Color'].default_value = (.985, .975, .96, 1); b.inputs['Transmission Weight'].default_value = 1; b.inputs['Roughness'].default_value = .025; b.inputs['IOR'].default_value = 1.47
g.data.materials.append(gm)
# the Build Record card: 1404 x 982 texture
card = plane('Build Record', .98, .98 * 982 / 1404, (1.6, .035, .05), image_mat('Card', 'build.webp', 1.0, alpha=1.6))
# a thin glass sliver on the card face so it carries its own highlight as it moves
# lights: a large soft key for the long glass reflection, a saffron rim for the bevel, a cool kicker
def area(name, loc, size, power, col, tgt):
    bpy.ops.object.light_add(type='AREA', location=loc); o = bpy.context.object; o.name = name; o.data.shape = 'RECTANGLE'; o.data.size, o.data.size_y = size; o.data.energy = power; o.data.color = col
    o.rotation_euler = (Vector(tgt) - o.location).to_track_quat('-Z', 'Y').to_euler(); return o
key = area('Key', (-1.6, -2.2, 1.9), (2.4, .5), 260, (1, .97, .93), (CX, 0, CZ))
rim = area('Saffron rim', (1.9, .6, .2), (.12, 2.2), 180, (1, .55, .2), (CX, 0, CZ))
area('Kicker', (-2.2, .5, -.6), (.12, 1.6), 60, (.85, .9, 1), (CX, 0, CZ))
world = bpy.data.worlds.new('W'); S.world = world; world.use_nodes = True; world.node_tree.nodes['Background'].inputs['Color'].default_value = (.004, .004, .005, 1)
# camera: a slow dolly with shallow focus on the glass
cd = bpy.data.cameras.new('Cam'); cam = bpy.data.objects.new('Cam', cd); S.collection.objects.link(cam); S.camera = cam; cd.lens = 58; cd.sensor_width = 36
tg = bpy.data.objects.new('Target', None); S.collection.objects.link(tg); tg.location = (-.05, 0, -.04)
tc = cam.constraints.new('TRACK_TO'); tc.target = tg; tc.track_axis = 'TRACK_NEGATIVE_Z'; tc.up_axis = 'UP_Y'
cd.dof.use_dof = True; cd.dof.aperture_fstop = 2.2; cd.dof.focus_object = g

# animation
N_ = max(A.anim, 2); S.frame_start, S.frame_end = 1, N_
def key_at(o, prop, frames):
    for f, v in frames: setattr(o, prop, v); o.keyframe_insert(prop, frame=max(1, round(f * N_)))
SX, SZ = CX, CZ + (.5 - 495 / 700) * CH   # the dashed slot in the Commons texture
key_at(cam, 'location', [(0, (.75, -4.3, .42)), (1, (.15, -3.75, .22))])
key_at(card, 'location', [(0, (1.75, .035, .12)), (.18, (1.55, .035, .1)), (.55, (.35, .035, -.06)), (.82, (SX, .035, SZ)), (1, (SX, .035, SZ))])
key_at(card, 'scale', [(0, (.98, .98 * 982 / 1404, 1)), (.55, (.78, .78 * 982 / 1404, 1)), (.82, (.41, .41 * 982 / 1404, 1)), (1, (.41, .41 * 982 / 1404, 1))])
key_at(card, 'rotation_euler', [(0, (math.radians(90), math.radians(-5), 0)), (.55, (math.radians(90), math.radians(2.5), 0)), (.82, (math.radians(90), 0, 0)), (1, (math.radians(90), 0, 0))])
key_at(rim.data, 'energy', [(0, 120), (.78, 120), (.88, 420), (1, 200)])
for o in (cam, card, rim.data):
    for fc in o.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'

# render
S.render.engine = 'CYCLES'; S.cycles.samples = A.samples; S.cycles.use_adaptive_sampling = True; S.cycles.use_denoising = True
try: S.cycles.denoiser = 'OPENIMAGEDENOISE'
except Exception: pass
S.cycles.max_bounces = 16; S.cycles.transmission_bounces = 14; S.cycles.glossy_bounces = 8; S.cycles.transparent_max_bounces = 16; S.cycles.blur_glossy = .5; S.cycles.caustics_reflective = False; S.cycles.caustics_refractive = False
S.cycles.device = 'GPU' if A.gpu else 'CPU'
if A.gpu:
    pr = bpy.context.preferences.addons['cycles'].preferences; chosen = None
    for t in ('OPTIX', 'CUDA'):
        try:
            pr.compute_device_type = t; pr.refresh_devices() if hasattr(pr, 'refresh_devices') else pr.get_devices()
            if [d for d in pr.devices if d.type == t]:
                for d in pr.devices: d.use = (d.type == t)
                chosen = t; break
        except Exception as e: print('GPU type failed', t, e)
    print('CYCLES_DEVICE', chosen, [(d.name, d.type, d.use) for d in pr.devices], flush=True)
    if not chosen: S.cycles.device = 'CPU'
w_, h_ = map(int, A.res.split('x')); S.render.resolution_x, S.render.resolution_y = w_, h_
S.view_settings.view_transform = 'Standard'; S.render.image_settings.file_format = 'PNG'; S.render.image_settings.color_depth = '8'
S.render.filepath = os.path.abspath(A.out)
if A.frame: S.frame_set(A.frame); bpy.ops.render.render(write_still=True)
else: bpy.ops.render.render(animation=True)
