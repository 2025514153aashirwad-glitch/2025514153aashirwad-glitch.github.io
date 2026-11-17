"""Samatva soul film: one engraved medallion per chapter, built from the real traced mark.
Run:  blender -b --factory-startup -P medallion.py -- <variant> <out.png> [samples] [frame-style]
variant: sun | wheel | hexagon | octagon
Each variant has its own metal treatment (see LOOKS). Everything is procedural apart from the traced SVG parts and the CC0 HDRI."""
import bpy, sys, os, math, addon_utils
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
VARIANT, OUT = argv[0], argv[1]
SAMPLES = int(argv[2]) if len(argv) > 2 else 96
HERE = os.path.dirname(os.path.abspath(__file__))
VEC = os.path.abspath(os.path.join(HERE, '../../../../../2025514153aashirwad-glitch.github.io/brand/logo/vector'))
if not os.path.isdir(VEC): VEC = '/home/user/2025514153aashirwad-glitch.github.io/brand/logo/vector'
HDRI = '/home/user/tools/assets/hdri/brown_photostudio_02.hdr'

# metal looks per chapter: base colour, roughness, and how each part is treated
LOOKS = {
    'sun':     dict(disc=((0.50, 0.33, 0.15), .36), relief=((0.78, 0.55, 0.26), .22), emblem='same', tri='same', ground='wood', key=(1.0, .82, .62)),
    'wheel':   dict(disc=((0.55, 0.56, 0.58), .32), relief=((0.80, 0.81, 0.83), .2), emblem='same', tri='enamel', ground='slate', key=(.92, .95, 1.0)),
    'hexagon': dict(disc=((0.30, 0.17, 0.09), .42), relief=((0.55, 0.33, 0.16), .26), emblem='hot', tri='same', ground='slate', key=(1.0, .78, .55)),
    'octagon': dict(disc=((0.16, 0.155, 0.15), .62), relief=((0.26, 0.25, 0.24), .48), emblem='same', tri='polished', ground='slate', key=(.95, .95, .95)),
}
L = LOOKS[VARIANT]

# ---------- scene ----------
sc = bpy.context.scene
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
sc.render.film_transparent = False

def mat_metal(name, col, rough, aniso=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = 1.0; b.inputs['Roughness'].default_value = rough
    if aniso:
        b.inputs['Anisotropic'].default_value = aniso
        b.inputs['Roughness'].default_value = rough
        nt = m.node_tree; tan = nt.nodes.new('ShaderNodeTangent'); tan.direction_type = 'RADIAL'; tan.axis = 'Z'
        nt.links.new(tan.outputs[0], b.inputs['Tangent'])
    # fine machining noise in the roughness
    nt = m.node_tree; n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 900; n.inputs['Detail'].default_value = 2
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = rough * .8; mr.inputs['To Max'].default_value = min(1, rough * 1.25)
    nt.links.new(n.outputs['Fac'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], b.inputs['Roughness'])
    return m

def mat_enamel(name, col):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = .06
    b.inputs['Coat Weight'].default_value = 1.0; b.inputs['Coat Roughness'].default_value = .02
    return m

def mat_hot(name):
    """Bronze still glowing from the pour: blackbody emission fading from the centre outward."""
    m = mat_metal(name, (0.45, 0.25, 0.12), .35); nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); g = nt.nodes.new('ShaderNodeTexGradient'); g.gradient_type = 'SPHERICAL'
    mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (6.5, 6.5, 6.5)
    geo = nt.nodes.new('ShaderNodeNewGeometry'); mp.name = 'hotmap'
    nt.links.new(geo.outputs['Position'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], g.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB'); e = ramp.color_ramp.elements
    e[0].position, e[0].color = 0.0, (0, 0, 0, 1); e[1].position, e[1].color = .9, (1, 1, 1, 1)
    nt.links.new(g.outputs['Fac'], ramp.inputs['Fac'])
    bb = nt.nodes.new('ShaderNodeBlackbody'); bb.inputs['Temperature'].default_value = 1350
    nt.links.new(bb.outputs[0], b.inputs['Emission Color'])
    mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = 14.0
    nt.links.new(ramp.outputs['Color'], mul.inputs[0]); nt.links.new(mul.outputs[0], b.inputs['Emission Strength'])
    return m

def mat_ground(kind):
    m = bpy.data.materials.new('ground'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    if kind == 'wood':   # dark warm walnut, procedural grain
        w = nt.nodes.new('ShaderNodeTexWave'); w.wave_type = 'BANDS'; w.inputs['Scale'].default_value = 2.2; w.inputs['Distortion'].default_value = 9; w.inputs['Detail'].default_value = 6
        r = nt.nodes.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = (.008, .004, .002, 1); r.color_ramp.elements[1].color = (.035, .016, .007, 1)
        nt.links.new(w.outputs['Fac'], r.inputs['Fac']); nt.links.new(r.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .55
    else:                # dark slate stone
        n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 40; n.inputs['Detail'].default_value = 8
        r = nt.nodes.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = (.002, .002, .0025, 1); r.color_ramp.elements[1].color = (.01, .01, .011, 1)
        nt.links.new(n.outputs['Fac'], r.inputs['Fac']); nt.links.new(r.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = .9
    return m

# ---------- the medallion ----------
R = 1.0   # disc radius (m, scene units); the mark spans about 1.3 R high
bpy.ops.mesh.primitive_cylinder_add(vertices=256, radius=R, depth=.12, location=(0, 0, -.06))
disc = bpy.context.object; disc.name = 'disc'
bev = disc.modifiers.new('bev', 'BEVEL'); bev.width = .025; bev.segments = 6; bev.limit_method = 'ANGLE'
bpy.ops.object.shade_smooth(); disc.data.materials.append(mat_metal('disc', *L['disc'], aniso=.6))
# a raised rim, as on a struck coin
bpy.ops.mesh.primitive_torus_add(major_radius=R * .965, minor_radius=.022, major_segments=256, minor_segments=24, location=(0, 0, .0))
rim = bpy.context.object; bpy.ops.object.shade_smooth(); rim.data.materials.append(mat_metal('rim', *L['relief']))

# ---------- the mark, from the traced SVG parts ----------
addon_utils.enable('io_curve_svg', default_set=True)
parts = {}
for part in ('crescent', 'infinity', 'emblem', 'triangles'):
    f = os.path.join(VEC, f'{VARIANT}-{part}.svg')
    if not os.path.exists(f): continue
    before = set(bpy.data.objects); bpy.ops.import_curve.svg(filepath=f)
    new = [o for o in bpy.data.objects if o not in before and o.type == 'CURVE']
    for o in new: o.select_set(True)
    bpy.context.view_layer.objects.active = new[0]
    if len(new) > 1: bpy.ops.object.join()
    parts[part] = bpy.context.view_layer.objects.active
# normalise: centre the whole mark on the disc, 1.36 R tall
allp = list(parts.values())
for o in allp: o.data.dimensions = '2D'
bpy.context.view_layer.update()
mins = Vector((1e9, 1e9, 0)); maxs = Vector((-1e9, -1e9, 0))
for o in allp:
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c); mins.x, mins.y = min(mins.x, w.x), min(mins.y, w.y); maxs.x, maxs.y = max(maxs.x, w.x), max(maxs.y, w.y)
h = maxs.y - mins.y; s = 1.36 * R / h; ctr = (mins + maxs) / 2
LOOK_MAT = {'relief': mat_metal('relief', *L['relief'])}
for name, o in parts.items():
    o.location = (o.location - ctr) * s; o.scale = o.scale * s
    o.data.extrude = .007 / s; o.data.bevel_depth = .0035 / s; o.data.bevel_resolution = 3; o.data.fill_mode = 'BOTH'
    o.location.z = .007
    kind = L['emblem'] if name == 'emblem' else L['tri'] if name == 'triangles' else 'same'
    if kind == 'enamel':
        m = mat_enamel('enamel', (.004, .022, .2)); o.location.z = .0015   # inlaid, sits lower than the raised silver
    elif kind == 'hot': m = mat_hot('hot')
    elif kind == 'polished': m = mat_metal('polished', (.9, .9, .88), .06)
    else: m = LOOK_MAT['relief']
    o.data.materials.clear(); o.data.materials.append(m)
    o.name = name
    if kind == 'hot':   # centre the glow on the emblem in world space
        bpy.context.view_layer.update()
        ws = [o.matrix_world @ Vector(c) for c in o.bound_box]
        cx = sum(v.x for v in ws) / 8; cy = sum(v.y for v in ws) / 8; rad = max(max(v.x for v in ws) - cx, max(v.y for v in ws) - cy) * 1.05
        mp = m.node_tree.nodes['hotmap']; k = 1 / rad
        mp.inputs['Scale'].default_value = (k, k, k); mp.inputs['Location'].default_value = (-cx * k, -cy * k, 0)

# ---------- ground, light, camera ----------
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -.121)); g = bpy.context.object; g.data.materials.append(mat_ground(L['ground']))
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; nt = w.node_tree
env = nt.nodes.new('ShaderNodeTexEnvironment'); env.image = bpy.data.images.load(HDRI)
nt.links.new(env.outputs[0], nt.nodes['Background'].inputs[0]); nt.nodes['Background'].inputs[1].default_value = .12
# low raking key light from the upper left: it pulls the relief out of the metal
bpy.ops.object.light_add(type='AREA', location=(-3.2, 2.4, 1.15)); key = bpy.context.object
key.data.energy = 420; key.data.size = 1.0; key.data.color = L['key']
key.rotation_euler = (Vector((0, 0, 0)) - key.location).to_track_quat('-Z', 'Y').to_euler()
bpy.ops.object.light_add(type='AREA', location=(3.5, -1.0, 2.5)); fill = bpy.context.object
fill.data.energy = 25; fill.data.size = 4; fill.rotation_euler = (Vector((0, 0, 0)) - fill.location).to_track_quat('-Z', 'Y').to_euler()

bpy.ops.object.light_add(type='SPOT', location=(0.3, -0.6, 4.2)); sp = bpy.context.object
sp.data.energy = 900; sp.data.spot_size = math.radians(34); sp.data.spot_blend = .6; sp.data.color = L['key']
sp.rotation_euler = (Vector((0, 0, 0)) - sp.location).to_track_quat('-Z', 'Y').to_euler()
bpy.ops.object.camera_add(location=(0.7, -4.6, 3.3)); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 58
target = Vector((0.12, 0.08, 0.0))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam.data.dof.use_dof = True; cam.data.dof.focus_distance = (target - cam.location).length; cam.data.dof.aperture_fstop = 2.0

sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('DONE', OUT)
