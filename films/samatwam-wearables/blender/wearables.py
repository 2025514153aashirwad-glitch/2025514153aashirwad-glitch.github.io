# Samatwam Physical AI · five wearables, modelled at real scale (metres), one studio, one key light.
# Run:  blender -b -P wearables.py -- --shot W1 --mode still --out out/W1.png [--samples 64] [--res 1920x1080]
#       blender -b -P wearables.py -- --shot W1 --mode turntable --out out/W1_#### [--frames 150]
#       blender -b -P wearables.py -- --save wearables.blend      (writes the library file)
import bpy, bmesh, math, sys, argparse
from mathutils import Vector, Euler

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument('--shot', default='W1'); ap.add_argument('--mode', default='still'); ap.add_argument('--out', default='//out/W1.png')
ap.add_argument('--samples', type=int, default=64); ap.add_argument('--res', default='1920x1080'); ap.add_argument('--frames', type=int, default=150)
ap.add_argument('--save', default=''); ap.add_argument('--gpu', action='store_true')
A = ap.parse_args(argv)
MM = 0.001

# ---------------------------------------------------------------- scene reset
bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
S.unit_settings.system = 'METRIC'; S.unit_settings.scale_length = 1.0

def link(o, col):
    for c in o.users_collection: c.objects.unlink(o)
    col.objects.link(o); return o
def collection(name):
    c = bpy.data.collections.new(name); S.collection.children.link(c); return c
def active(o):
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
def bevel(o, w, seg=4):
    m = o.modifiers.new('Bevel', 'BEVEL'); m.width = w; m.segments = seg; m.limit_method = 'ANGLE'; m.harden_normals = False; return m
def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
def boolean(o, cutter, op='DIFFERENCE'):
    m = o.modifiers.new('Bool', 'BOOLEAN'); m.object = cutter; m.operation = op; m.solver = 'EXACT'; cutter.hide_render = True; cutter.hide_viewport = True; return m

# ---------------------------------------------------------------- materials (no image textures: everything procedural, so the repo stays small)
def node_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']; return m, nt, bsdf
def set_in(b, key, v):
    if key in b.inputs: b.inputs[key].default_value = v
def brushed_metal(name, col, rough=.22, aniso=.7, radial=False):
    m, nt, b = node_mat(name); set_in(b, 'Base Color', (*col, 1)); set_in(b, 'Metallic', 1.0); set_in(b, 'Roughness', rough); set_in(b, 'Anisotropic', aniso)
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 1)
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 900; nz.inputs['Detail'].default_value = 2
    mp.inputs['Scale'].default_value = (1, 1, 0.004) if not radial else (1, 0.004, 1)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = .06; bump.inputs['Distance'].default_value = .00002
    nt.links.new(nz.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    # faint fingerprints and handling marks: roughness varies a little
    sm = nt.nodes.new('ShaderNodeTexNoise'); sm.inputs['Scale'].default_value = 140; sm.inputs['Detail'].default_value = 6
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = rough * .8; mr.inputs['To Max'].default_value = rough * 1.35
    nt.links.new(tc.outputs['Object'], sm.inputs['Vector']); nt.links.new(sm.outputs['Fac'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], b.inputs['Roughness'])
    return m
def plain(name, col, rough=.5, metal=0.0, coat=0.0, sheen=0.0):
    m, nt, b = node_mat(name); set_in(b, 'Base Color', (*col, 1)); set_in(b, 'Roughness', rough); set_in(b, 'Metallic', metal)
    set_in(b, 'Coat Weight', coat); set_in(b, 'Sheen Weight', sheen); return m
def glass(name, tint=(0.95, 0.97, 1.0), rough=0.02):
    m, nt, b = node_mat(name); set_in(b, 'Base Color', (*tint, 1)); set_in(b, 'Transmission Weight', 1.0); set_in(b, 'Roughness', rough); set_in(b, 'IOR', 1.5); return m
def emissive(name, col, strength):
    m, nt, b = node_mat(name); set_in(b, 'Base Color', (*col, 1)); set_in(b, 'Emission Color', (*col, 1)); set_in(b, 'Emission Strength', strength); return m
def knit(name, col):
    m, nt, b = node_mat(name); set_in(b, 'Base Color', (*col, 1)); set_in(b, 'Roughness', .85); set_in(b, 'Sheen Weight', .6)
    tc = nt.nodes.new('ShaderNodeTexCoord'); wv = nt.nodes.new('ShaderNodeTexWave'); wv.inputs['Scale'].default_value = 900; wv.inputs['Distortion'].default_value = 2.5
    vo = nt.nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 1400
    mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MULTIPLY'
    nt.links.new(tc.outputs['Object'], wv.inputs['Vector']); nt.links.new(tc.outputs['Object'], vo.inputs['Vector'])
    nt.links.new(wv.outputs['Fac'], mx.inputs[0]); nt.links.new(vo.outputs['Distance'], mx.inputs[1])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = .5; bump.inputs['Distance'].default_value = .0004
    nt.links.new(mx.outputs['Value'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal']); return m

M = {
  'titanium': brushed_metal('Titanium brushed', (0.56, 0.56, 0.58), .2, .75),
  'alu_navy': brushed_metal('Aluminium anodised navy', (0.05, 0.09, 0.22), .3, .5),
  'alu': brushed_metal('Aluminium brushed radial', (0.80, 0.81, 0.83), .18, .8, radial=True),
  'silicone': plain('Silicone matte', (0.035, 0.04, 0.05), .62, sheen=.2),
  'pad': brushed_metal('Electrode steel', (0.7, 0.7, 0.72), .3, .3),
  'acetate': plain('Acetate black', (0.012, 0.012, 0.014), .18, coat=.6),
  'lens': glass('Lens glass'),
  'camlens': plain('Camera lens black', (0.005, 0.005, 0.008), .05, coat=1.0),
  'knit': knit('Knit grey', (0.18, 0.19, 0.21)),
  'rubber': plain('Force pad rubber', (0.02, 0.022, 0.025), .45),
  'cord': knit('Fabric cord', (0.06, 0.065, 0.075)),
  'led': emissive('Status light saffron', (1.0, 0.45, 0.12), 6.0),
  'window': plain('Sensor window', (0.01, 0.01, 0.012), .08, coat=1.0),
  'floor': plain('Studio floor', (0.012, 0.013, 0.015), .6),
}

# ---------------------------------------------------------------- the five wearables
def tube(name, r_out, r_in, depth, verts=128):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=False, radius=r_out, segments=verts)
    ring = bm.edges[:]; ext = bmesh.ops.extrude_edge_only(bm, edges=ring)
    v = [e for e in ext['geom'] if isinstance(e, bmesh.types.BMVert)]; bmesh.ops.translate(bm, verts=v, vec=(0, 0, depth))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); S.collection.objects.link(o)
    sol = o.modifiers.new('Wall', 'SOLIDIFY'); sol.thickness = r_out - r_in; sol.offset = 1.0; sol.use_even_offset = True
    o.location.z = -depth / 2; return o

def W1_ring(col):
    root = bpy.data.objects.new('W1_root', None); S.collection.objects.link(root); link(root, col)
    r = tube('W1 ring band', 11.6 * MM, 9.0 * MM, 8 * MM); r.data.materials.append(M['titanium']); bevel(r, .9 * MM, 6); smooth(r)
    r.modifiers.new('WN', 'WEIGHTED_NORMAL'); r.parent = root; link(r, col)
    bpy.ops.mesh.primitive_cube_add(size=1); w = bpy.context.object; w.name = 'W1 sensor window'; w.scale = (3.2 * MM, .5 * MM, 5 * MM); w.location = (0, -9.1 * MM, 0)
    w.data.materials.append(M['window']); bevel(w, .3 * MM, 3); w.parent = root; link(w, col)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.55 * MM, segments=24, ring_count=12); l = bpy.context.object; l.name = 'W1 status light'; l.location = (0, 11.55 * MM, 1.6 * MM); l.scale.y = .35
    l.data.materials.append(M['led']); smooth(l); l.parent = root; link(l, col)
    root.rotation_euler = (math.radians(90), 0, math.radians(38)); root.location.z = 11.6 * MM
    return root, 0.05

def W2_band(col):
    root = bpy.data.objects.new('W2_root', None); S.collection.objects.link(root); link(root, col)
    s = tube('W2 strap', 30 * MM, 26.5 * MM, 22 * MM); s.scale.x = 1.22; s.data.materials.append(M['silicone']); bevel(s, 1.2 * MM, 5); smooth(s); s.parent = root; link(s, col)
    bpy.ops.mesh.primitive_cube_add(size=1); p = bpy.context.object; p.name = 'W2 module'; p.scale = (40 * MM, 9 * MM, 26 * MM); p.location = (0, -34 * MM, 0)
    p.data.materials.append(M['alu_navy']); bevel(p, 3.5 * MM, 8); smooth(p); p.parent = root; link(p, col)
    bpy.ops.mesh.primitive_cylinder_add(radius=.7 * MM, depth=.6 * MM, vertices=32); l = bpy.context.object; l.name = 'W2 status light'; l.rotation_euler.x = math.radians(90); l.location = (14 * MM, -38.6 * MM, 8 * MM)
    l.data.materials.append(M['led']); l.parent = root; link(l, col)
    for i in range(8):
        a = math.radians(-50 + i * 14.3 + 180 * (i >= 4) - 60 * (i >= 4))
        bpy.ops.mesh.primitive_cylinder_add(radius=2.6 * MM, depth=.8 * MM, vertices=48); e = bpy.context.object; e.name = f'W2 electrode {i + 1}'
        e.location = (math.sin(a) * 26.2 * MM * 1.22, math.cos(a) * 26.2 * MM, (-5 if i % 2 else 5) * MM); e.rotation_euler = (math.radians(90), 0, -a)
        e.data.materials.append(M['pad']); bevel(e, .25 * MM, 3); e.parent = root; link(e, col)
    root.rotation_euler = (math.radians(90), 0, math.radians(-28)); root.location.z = 30 * MM
    return root, 0.13

def rounded_slab(name, w, h, d, r, mat):
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object; o.name = name; o.scale = (w, d, h)
    bpy.ops.object.transform_apply(scale=True); m = bevel(o, r, 10); m.limit_method = 'NONE'; m.affect = 'EDGES'
    o.data.materials.append(mat); smooth(o); return o
def W3_glasses(col):
    root = bpy.data.objects.new('W3_root', None); S.collection.objects.link(root); link(root, col)
    for sx in (-1, 1):
        f = rounded_slab(f'W3 rim {sx}', 52 * MM, 40 * MM, 5 * MM, 12 * MM, M['acetate']); f.location = (sx * 32 * MM, 0, 0)
        cut = rounded_slab(f'W3 rim cut {sx}', 44 * MM, 32 * MM, 12 * MM, 9 * MM, M['acetate']); cut.location = f.location
        bpy.context.view_layer.update(); boolean(f, cut); f.parent = root; link(f, col); cut.parent = root; link(cut, col)
        ln = rounded_slab(f'W3 lens {sx}', 45 * MM, 33 * MM, 1.6 * MM, 9.5 * MM, M['lens']); ln.location = f.location; ln.parent = root; link(ln, col)
        t = rounded_slab(f'W3 temple {sx}', 4 * MM, 6 * MM, 130 * MM, 1.8 * MM, M['acetate']); t.location = (sx * 57 * MM, 66 * MM, 10 * MM)
        t.rotation_euler.z = math.radians(sx * -9); t.parent = root; link(t, col)
    b = rounded_slab('W3 bridge', 14 * MM, 6 * MM, 5 * MM, 2.5 * MM, M['acetate']); b.location = (0, 0, 13 * MM); b.parent = root; link(b, col)
    bpy.ops.mesh.primitive_cylinder_add(radius=2.2 * MM, depth=2 * MM, vertices=48); c = bpy.context.object; c.name = 'W3 camera'; c.rotation_euler.x = math.radians(90); c.location = (0, -3 * MM, 13 * MM)
    c.data.materials.append(M['camlens']); bevel(c, .4 * MM, 4); c.parent = root; link(c, col)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.6 * MM); l = bpy.context.object; l.location = (6 * MM, -2.8 * MM, 13 * MM); l.data.materials.append(M['led']); l.parent = root; link(l, col)
    root.rotation_euler = (0, 0, math.radians(24)); root.location.z = 20 * MM
    return root, 0.2

def W4_glove(col):
    root = bpy.data.objects.new('W4_root', None); S.collection.objects.link(root); link(root, col)
    mb = bpy.data.metaballs.new('W4 glove'); mb.resolution = .0012; mb.render_resolution = .0007; mb.threshold = .6
    def cap(co, length, r, rot_z):
        e = mb.elements.new(type='CAPSULE'); e.co = co; e.radius = r; e.size_x = length / 2
        e.rotation = Euler((0, 0, rot_z)).to_quaternion(); return e
    # palm, then fingers fanned slightly; dimensions of an adult medium hand
    pe = mb.elements.new(type='ELLIPSOID'); pe.co = (0, 0, 0); pe.radius = .045; pe.size_x, pe.size_y, pe.size_z = .9, 1.0, .32
    fingers = [(-0.030, 0.058, .060, .0105, 1.70), (-0.010, 0.066, .070, .0110, 1.60), (0.010, 0.066, .074, .0112, 1.54), (0.029, 0.060, .066, .0105, 1.46), (0.050, 0.004, .058, .0125, 0.70)]
    tips = []
    for x, y, L, r, a in fingers:
        cx, cy = x + math.cos(a) * L / 2, y + math.sin(a) * L / 2; cap((cx, cy, 0), L, r, a); tips.append((x + math.cos(a) * L, y + math.sin(a) * L, r))
    cap((0, -0.05, 0), .03, .03, math.radians(90))  # cuff
    g = bpy.data.objects.new('W4 glove', mb); S.collection.objects.link(g); g.data.materials.append(M['knit'])
    active(g); bpy.ops.object.convert(target='MESH'); g = bpy.context.object; smooth(g); g.parent = root; link(g, col)
    for i, (x, y, r) in enumerate(tips):
        bpy.ops.mesh.primitive_cylinder_add(radius=r * .7, depth=.0012, vertices=48); p = bpy.context.object; p.name = f'W4 force pad {i + 1}'
        p.location = (x * .93, y * .93, -r * .78); p.data.materials.append(M['rubber']); bevel(p, .0004, 3); smooth(p); p.parent = root; link(p, col)
    m = rounded_slab('W4 wrist module', 34 * MM, 6 * MM, 22 * MM, 3 * MM, M['alu_navy']); m.location = (0, -0.058, .016); m.parent = root; link(m, col)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.7 * MM); l = bpy.context.object; l.location = (11 * MM, -0.058, .0195); l.data.materials.append(M['led']); l.parent = root; link(l, col)
    root.rotation_euler = (0, 0, math.radians(-20)); root.location.z = .016
    return root, 0.24

def W5_pendant(col):
    root = bpy.data.objects.new('W5_root', None); S.collection.objects.link(root); link(root, col)
    bpy.ops.mesh.primitive_cylinder_add(radius=20 * MM, depth=7 * MM, vertices=160); d = bpy.context.object; d.name = 'W5 disc'
    d.data.materials.append(M['alu']); bevel(d, 1.8 * MM, 8); smooth(d)
    for i in range(4):
        a = math.radians(45 + 90 * i); bpy.ops.mesh.primitive_cylinder_add(radius=.75 * MM, depth=6 * MM, vertices=24); h = bpy.context.object; h.name = f'W5 mic {i + 1}'
        h.location = (math.cos(a) * 9 * MM, math.sin(a) * 9 * MM, 3.5 * MM); bpy.context.view_layer.update(); boolean(d, h); h.parent = root; link(h, col)
    d.parent = root; link(d, col)
    bpy.ops.mesh.primitive_cylinder_add(radius=1.4 * MM, depth=.4 * MM, vertices=48); l = bpy.context.object; l.location = (0, 0, 3.55 * MM); l.data.materials.append(M['led']); l.parent = root; link(l, col)
    bpy.ops.mesh.primitive_torus_add(major_radius=3.2 * MM, minor_radius=1.0 * MM); bl = bpy.context.object; bl.name = 'W5 bail'; bl.rotation_euler.x = math.radians(90); bl.location = (0, 21.5 * MM, 0)
    bl.data.materials.append(M['alu']); smooth(bl); bl.parent = root; link(bl, col)
    cu = bpy.data.curves.new('W5 cord', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1.3 * MM; cu.bevel_resolution = 6
    sp = cu.splines.new('BEZIER'); pts = [(0, 22 * MM, 0), (14 * MM, 60 * MM, -3 * MM), (55 * MM, 95 * MM, -3.5 * MM), (120 * MM, 110 * MM, -3.5 * MM)]
    sp.bezier_points.add(len(pts) - 1)
    for bp, co in zip(sp.bezier_points, pts): bp.co = co; bp.handle_left_type = bp.handle_right_type = 'AUTO'
    c = bpy.data.objects.new('W5 cord', cu); S.collection.objects.link(c); c.data.materials.append(M['cord']); c.parent = root; link(c, col)
    root.rotation_euler = (0, 0, math.radians(-30)); root.location.z = 3.5 * MM
    return root, 0.09

# ---------------------------------------------------------------- studio: one key light, one rim strip, a dark floor; no HDRI
world = bpy.data.worlds.new('Studio'); S.world = world; world.use_nodes = True; world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.004, 0.0045, 0.006, 1)
studio = collection('Studio')
bpy.ops.mesh.primitive_plane_add(size=6); fl = bpy.context.object; fl.name = 'Floor'; fl.data.materials.append(M['floor']); link(fl, studio)
bpy.ops.mesh.primitive_plane_add(size=6); bk = bpy.context.object; bk.name = 'Backdrop'; bk.rotation_euler.x = math.radians(90); bk.location = (0, 1.2, 1); bk.data.materials.append(M['floor']); link(bk, studio)
def area(name, loc, size, power, col):
    bpy.ops.object.light_add(type='AREA', location=loc); l = bpy.context.object; l.name = name; l.data.shape = 'RECTANGLE'; l.data.size, l.data.size_y = size
    l.data.energy = power; l.data.color = col; link(l, studio); return l

SHOTS = {'W1': W1_ring, 'W2': W2_band, 'W3': W3_glasses, 'W4': W4_glove, 'W5': W5_pendant}
roots = {}
for k, fn in SHOTS.items():
    col = collection(k); roots[k] = fn(col)

def aim(o, target):
    d = Vector(target) - o.location; o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()

def setup_shot(k):
    for kk in SHOTS:
        for o in bpy.data.collections[kk].all_objects: o.hide_render = (kk != k) or o.hide_render if kk == k else True
    root, size = roots[k]
    for kk in SHOTS: roots[kk][0].location.x = 0 if kk == k else 50
    tgt = Vector((0, 0, root.location.z * .9))
    for o in list(bpy.data.collections['Studio'].objects):
        if o.type == 'LIGHT': bpy.data.objects.remove(o)
    d = size * 2.2
    key = area('Key softbox', tgt + Vector((-d * .9, -d * .8, d * 1.1)), (d * 1.2, d * .8), 140 * size * size / .0025 * .006, (1.0, .96, .9)); aim(key, tgt)
    rim = area('Rim strip', tgt + Vector((d * 1.1, d * .9, d * .5)), (d * .15, d * 1.4), 90 * size * size / .0025 * .012, (.8, .88, 1.0)); aim(rim, tgt)
    cam_d = size * 3.3
    if 'Camera' not in bpy.data.objects:
        cd = bpy.data.cameras.new('Camera'); cam = bpy.data.objects.new('Camera', cd); S.collection.objects.link(cam); S.camera = cam
    cam = bpy.data.objects['Camera']; cam.data.lens = 100; cam.data.sensor_width = 36
    cam.location = tgt + Vector((cam_d * .35, -cam_d, cam_d * .42)); aim(cam, tgt)
    cam.data.dof.use_dof = True; cam.data.dof.focus_distance = (cam.location - tgt).length; cam.data.dof.aperture_fstop = 5.6
    return root

def render_setup():
    S.render.engine = 'CYCLES'; S.cycles.samples = A.samples; S.cycles.use_denoising = True
    try: S.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception: pass
    S.cycles.device = 'GPU' if A.gpu else 'CPU'
    if A.gpu:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        for t in ('OPTIX', 'CUDA'):
            try: prefs.compute_device_type = t; prefs.get_devices(); break
            except Exception: continue
        for dv in prefs.devices: dv.use = True
    w, h = map(int, A.res.split('x')); S.render.resolution_x, S.render.resolution_y = w, h; S.render.resolution_percentage = 100
    S.cycles.max_bounces = 8; S.cycles.transmission_bounces = 8; S.cycles.caustics_reflective = False
    try: S.view_settings.view_transform = 'AgX'; S.view_settings.look = 'AgX - Medium High Contrast'
    except Exception: pass
    S.render.film_transparent = False

render_setup()
if A.save:
    setup_shot('W1'); bpy.ops.wm.save_as_mainfile(filepath=bpy.path.abspath(A.save)); sys.exit(0)
root = setup_shot(A.shot)
if A.mode == 'still':
    S.render.filepath = A.out; S.render.image_settings.file_format = 'PNG'; bpy.ops.render.render(write_still=True)
else:
    S.frame_start, S.frame_end = 1, A.frames; S.render.fps = 30
    z0 = root.rotation_euler.z; root.rotation_euler.z = z0 - math.radians(45); root.keyframe_insert('rotation_euler', index=2, frame=1)
    root.rotation_euler.z = z0 + math.radians(45); root.keyframe_insert('rotation_euler', index=2, frame=A.frames)
    for fc in root.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation = 'BEZIER'; kp.easing = 'EASE_IN_OUT'
    S.render.filepath = A.out; S.render.image_settings.file_format = 'PNG'; bpy.ops.render.render(animation=True)
