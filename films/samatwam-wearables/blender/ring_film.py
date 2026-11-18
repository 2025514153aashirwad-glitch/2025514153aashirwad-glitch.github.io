# W1 Ring film shots. Real scale (metres). Two studios only: black and white. Titanium with embossed Samatwam marks tiled across every surface.
# blender -b -P ring_film.py -- --shot black_hero --out out/black_hero.png --samples 128 --res 1920x1080
# blender -b -P ring_film.py -- --shot white_turn --anim 90 --out out/white_turn_#### --samples 48 --res 1280x720
import bpy, bmesh, math, sys, os, argparse
from mathutils import Vector
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ap = argparse.ArgumentParser(); ap.add_argument('--shot', default='black_hero'); ap.add_argument('--out', default='out/x.png')
ap.add_argument('--samples', type=int, default=96); ap.add_argument('--res', default='1920x1080'); ap.add_argument('--anim', type=int, default=0); ap.add_argument('--gpu', action='store_true')
A = ap.parse_args(argv); MM = .001; HERE = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True); S = bpy.context.scene

def node_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; return m, m.node_tree, m.node_tree.nodes['Principled BSDF']
def si(b, k, v):
    if k in b.inputs: b.inputs[k].default_value = v

# ---------------------------------------------------------------- titanium with an embossed, light-coloured logo field
def titanium():
    m, nt, b = node_mat('Titanium embossed'); N = nt.nodes; L = nt.links
    si(b, 'Metallic', 1.0); si(b, 'Anisotropic', .55)
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sep.inputs[0])
    at = N.new('ShaderNodeMath'); at.operation = 'ARCTAN2'; L.new(sep.outputs['Y'], at.inputs[0]); L.new(sep.outputs['X'], at.inputs[1])
    u = N.new('ShaderNodeMath'); u.operation = 'MULTIPLY'; u.inputs[1].default_value = 11.6 * MM; L.new(at.outputs[0], u.inputs[0])   # arc length around the band
    # on the flat side faces, use radius instead so the marks also cover the edges
    rad = N.new('ShaderNodeVectorMath'); rad.operation = 'LENGTH'; L.new(tc.outputs['Object'], rad.inputs[0])
    nrm = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Normal'], nrm.inputs[0]); side = N.new('ShaderNodeMath'); side.operation = 'ABSOLUTE'; L.new(nrm.outputs['Z'], side.inputs[0])
    gt = N.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = .7; L.new(side.outputs[0], gt.inputs[0])
    vz = N.new('ShaderNodeMix'); vz.data_type = 'FLOAT'; L.new(gt.outputs[0], vz.inputs['Factor']); L.new(sep.outputs['Z'], vz.inputs['A']); L.new(rad.outputs['Value'], vz.inputs['B'])
    cmb = N.new('ShaderNodeCombineXYZ'); L.new(u.outputs[0], cmb.inputs['X']); L.new(vz.outputs['Result'], cmb.inputs['Y'])
    mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1 / (5.6 * MM), 1 / (5.6 * MM), 1); L.new(cmb.outputs[0], mp.inputs['Vector'])
    tex = N.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(os.path.join(HERE, 'logo_tile.png')); tex.image.colorspace_settings.name = 'Non-Color'; tex.extension = 'REPEAT'; tex.interpolation = 'Cubic'
    L.new(mp.outputs['Vector'], tex.inputs['Vector'])
    # colour: graphite titanium, the marks a pale satin silver
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.inputs['A'].default_value = (.40, .40, .42, 1); mix.inputs['B'].default_value = (.66, .66, .67, 1)
    gain = N.new('ShaderNodeMath'); gain.operation = 'MULTIPLY'; gain.inputs[1].default_value = .9; L.new(tex.outputs['Color'], gain.inputs[0])
    L.new(gain.outputs[0], mix.inputs['Factor']); L.new(mix.outputs['Result'], b.inputs['Base Color'])
    rough = N.new('ShaderNodeMapRange'); rough.inputs['To Min'].default_value = .2; rough.inputs['To Max'].default_value = .36; L.new(tex.outputs['Color'], rough.inputs['Value'])
    # brushed grain along the band, plus faint handling marks
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1; nz.inputs['Detail'].default_value = 3
    gm = N.new('ShaderNodeMapping'); gm.inputs['Scale'].default_value = (900, 9, 9); L.new(cmb.outputs[0], gm.inputs['Vector']); L.new(gm.outputs['Vector'], nz.inputs['Vector'])
    sm = N.new('ShaderNodeTexNoise'); sm.inputs['Scale'].default_value = 160; sm.inputs['Detail'].default_value = 6; L.new(tc.outputs['Object'], sm.inputs['Vector'])
    radd = N.new('ShaderNodeMath'); radd.operation = 'MULTIPLY_ADD'; radd.inputs[1].default_value = .08; L.new(sm.outputs['Fac'], radd.inputs[0]); L.new(rough.outputs['Result'], radd.inputs[2])
    L.new(radd.outputs[0], b.inputs['Roughness'])
    h = N.new('ShaderNodeMath'); h.operation = 'MULTIPLY_ADD'; h.inputs[1].default_value = .05; L.new(nz.outputs['Fac'], h.inputs[0]); L.new(tex.outputs['Color'], h.inputs[2])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 1.0; bump.inputs['Distance'].default_value = .00004
    L.new(h.outputs[0], bump.inputs['Height']); L.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m
def plain(name, col, rough, coat=0, metal=0, spec=.5):
    m, nt, b = node_mat(name); si(b, 'Base Color', (*col, 1)); si(b, 'Roughness', rough); si(b, 'Coat Weight', coat); si(b, 'Metallic', metal); si(b, 'Specular IOR Level', spec); return m
def emit(name, col, s):
    m, nt, b = node_mat(name); si(b, 'Base Color', (*col, 1)); si(b, 'Emission Color', (*col, 1)); si(b, 'Emission Strength', s); return m

TI = titanium(); WIN = plain('Sensor window', (.004, .004, .006), .05, coat=1); LED = emit('Status light', (1, .42, .1), 0 if 'dark' in A.shot else 8)
LED_OFF = plain('Status light off', (.15, .08, .04), .2, coat=1)

# ---------------------------------------------------------------- the ring: 18 mm inner diameter, 2.6 mm wall, 8 mm band, comfort-fit edges
def tube(name, r_out, r_in, depth, verts=256):
    bm = bmesh.new(); bmesh.ops.create_circle(bm, cap_ends=False, radius=r_out, segments=verts)
    ext = bmesh.ops.extrude_edge_only(bm, edges=bm.edges[:]); bmesh.ops.translate(bm, verts=[e for e in ext['geom'] if isinstance(e, bmesh.types.BMVert)], vec=(0, 0, depth))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); S.collection.objects.link(o)
    sol = o.modifiers.new('Wall', 'SOLIDIFY'); sol.thickness = r_out - r_in; sol.offset = 1.0; sol.use_even_offset = True
    bv = o.modifiers.new('Bevel', 'BEVEL'); bv.width = 1.0 * MM; bv.segments = 8; bv.limit_method = 'ANGLE'
    o.modifiers.new('WN', 'WEIGHTED_NORMAL'); o.data.polygons.foreach_set('use_smooth', [True] * len(o.data.polygons)); o.location.z = -depth / 2; return o
root = bpy.data.objects.new('Ring', None); S.collection.objects.link(root)
ring = tube('Ring band', 11.6 * MM, 9.0 * MM, 8 * MM); ring.data.materials.append(TI); ring.parent = root
bpy.ops.mesh.primitive_cube_add(size=1); w = bpy.context.object; w.scale = (3.2 * MM, .45 * MM, 5 * MM); w.location = (0, -9.15 * MM, 0); w.data.materials.append(WIN)
b = w.modifiers.new('B', 'BEVEL'); b.width = .3 * MM; b.segments = 4; w.parent = root
bpy.ops.mesh.primitive_uv_sphere_add(radius=.5 * MM, segments=32, ring_count=16); l = bpy.context.object; l.location = (0, 11.62 * MM, 1.8 * MM); l.scale.y = .3; l.data.materials.append(LED); l.parent = root
for p in l.data.polygons: p.use_smooth = True

# ---------------------------------------------------------------- studios: seamless sweep (floor curving into the wall), one key, one rim or fill
WHITE = A.shot.startswith('white')
bpy.ops.mesh.primitive_plane_add(size=1); sw = bpy.context.object; sw.name = 'Sweep'
bm = bmesh.new(); bm.from_mesh(sw.data); bm.clear(); rows = []
for i in range(41):
    t = i / 40; ang = t * math.pi / 2; y = -1 + (0 if t < .5 else 0) ; R = .35
    if t < .5: py, pz = -1.5 + t * 2 * 1.5, 0
    else: a = (t - .5) * 2 * math.pi / 2; py, pz = math.sin(a) * R, R - math.cos(a) * R
    rows.append([bm.verts.new((x, py, pz)) for x in (-2, 2)])
rows.append([bm.verts.new((x, R, 2)) for x in (-2, 2)])
for r0, r1 in zip(rows, rows[1:]): bm.faces.new((r0[0], r0[1], r1[1], r1[0]))
bm.to_mesh(sw.data); bm.free(); sw.data.polygons.foreach_set('use_smooth', [True] * len(sw.data.polygons)); sw.location = (0, .12, 0)
sw.data.materials.append(plain('Sweep', (.8, .8, .8) if WHITE else (.0012, .0012, .0014), .55 if WHITE else .9, coat=0, spec=.5 if WHITE else 0.0))
world = bpy.data.worlds.new('W'); S.world = world; world.use_nodes = True; world.node_tree.nodes['Background'].inputs['Color'].default_value = (.7, .7, .7, 1) if WHITE else (.0015, .0015, .002, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = .1 if WHITE else 1

def flags():  # black cards that only show up in reflections: they give polished metal its shape on a white set
    for loc, rot, sz in (((-.06, -.03, .03), (90, 0, 70), .2), ((.07, -.02, .03), (90, 0, -60), .2), ((0, .01, .14), (0, 0, 0), .12)):
        bpy.ops.mesh.primitive_plane_add(size=sz, location=loc); f = bpy.context.object; f.rotation_euler = tuple(math.radians(v) for v in rot)
        f.data.materials.append(plain('Flag', (.0, .0, .0), .9, spec=0)); f.visible_camera = False; f.visible_shadow = False
if WHITE: flags()
def aim(o, t): o.rotation_euler = (Vector(t) - o.location).to_track_quat('-Z', 'Y').to_euler()
def area(name, loc, size, power, col=(1, 1, 1), t=(0, 0, .01)):
    bpy.ops.object.light_add(type='AREA', location=loc); o = bpy.context.object; o.name = name; o.data.shape = 'RECTANGLE'; o.data.size, o.data.size_y = size; o.data.energy = power; o.data.color = col; o.data.spread = math.radians(60 if not WHITE else 140); aim(o, t); return o
cd = bpy.data.cameras.new('Cam'); cam = bpy.data.objects.new('Cam', cd); S.collection.objects.link(cam); S.camera = cam; cd.sensor_width = 36; cd.dof.use_dof = True; cd.clip_start = .002; cd.clip_end = 20

# ---------------------------------------------------------------- shots
T0 = Vector((0, 0, 11.6 * MM))
def stand(rz): root.rotation_euler = (math.radians(90), 0, math.radians(rz)); root.location = (0, 0, 11.6 * MM)
def flat(rz): root.rotation_euler = (0, 0, math.radians(rz)); root.location = (0, 0, 4 * MM)
def camera(loc, tgt, lens, f):
    cam.location = loc; aim(cam, tgt); cd.lens = lens; cd.dof.focus_distance = (Vector(loc) - Vector(tgt)).length; cd.dof.aperture_fstop = f
shot = A.shot; key = None; anim = []
if shot == 'black_hero':
    stand(34); camera((.06, -.16, .05), T0, 100, 4); key = area('Key', (-.12, -.1, .16), (.18, .1), 4, (1, .97, .93)); area('Rim', (.14, .14, .05), (.02, .25), 6, (.85, .9, 1))
elif shot == 'black_sweep':   # a strip light slides across; the reflection travels over the marks
    stand(28); camera((.05, -.15, .035), T0, 100, 5.6); k = area('Strip', (-.2, -.08, .1), (.015, .3), 7, (1, .97, .93)); area('Rim', (.14, .14, .05), (.02, .25), 3, (.85, .9, 1))
    anim.append((k, 'location', [(-.2, -.08, .1), (.2, -.08, .1)]))
elif shot == 'black_inner':   # through the ring to the sensor window
    stand(-8); camera((.012, -.09, .028), (0, -.004, 11.6 * MM), 100, 8); area('Key', (-.08, -.06, .12), (.12, .08), 1.6, (1, .97, .93)); area('Rim', (.1, .12, .03), (.02, .2), 1.5, (.85, .9, 1))
elif shot == 'black_led':     # macro on the status light
    stand(14); camera((.016, -.05, .042), (0, -1.8 * MM, 23.2 * MM), 100, 5.6); area('Key', (-.09, -.06, .12), (.1, .06), 1.2, (1, .97, .93)); area('Rim', (.08, .1, .03), (.02, .15), 1.2, (.85, .9, 1))
elif shot == 'white_macro':   # the logo field, shallow depth of field
    stand(10); camera((.004, -.034, .05), (0, 0, 23.2 * MM), 100, 16); area('Key', (-.1, -.12, .14), (.25, .2), 6); area('Fill', (.15, -.05, .06), (.2, .2), 2)
elif shot == 'white_profile':
    stand(90); camera((0, -.2, .02), T0, 100, 8); area('Key', (-.12, -.1, .16), (.3, .25), 9); area('Fill', (.15, -.1, .04), (.25, .25), 2.5)
elif shot == 'white_flat':
    flat(0); camera((.05, -.13, .1), (0, 0, 3 * MM), 100, 5.6); area('Key', (-.1, -.06, .18), (.3, .25), 9); area('Fill', (.16, -.08, .05), (.25, .25), 2)
elif shot == 'white_turn':
    stand(0); camera((.05, -.17, .045), T0, 100, 5.6); area('Key', (-.12, -.1, .16), (.3, .25), 9); area('Fill', (.15, -.1, .04), (.25, .25), 2.5)
    anim.append((root, 'rotation_euler', [(math.radians(90), 0, math.radians(-30)), (math.radians(90), 0, math.radians(150))]))
elif shot == 'black_turn':
    stand(0); camera((.05, -.17, .045), T0, 100, 5.6); area('Key', (-.12, -.1, .16), (.18, .1), 9, (1, .97, .93)); area('Rim', (.14, .14, .05), (.02, .25), 6, (.85, .9, 1))
    anim.append((root, 'rotation_euler', [(math.radians(90), 0, math.radians(-30)), (math.radians(90), 0, math.radians(150))]))

# ---------------------------------------------------------------- render
S.render.engine = 'CYCLES'; S.cycles.samples = A.samples; S.cycles.use_denoising = True
try: S.cycles.denoiser = 'OPENIMAGEDENOISE'
except Exception: pass
S.cycles.device = 'GPU' if A.gpu else 'CPU'
if A.gpu:
    pr = bpy.context.preferences.addons['cycles'].preferences
    for t in ('OPTIX', 'CUDA'):
        try: pr.compute_device_type = t; pr.get_devices(); break
        except Exception: pass
    for d in pr.devices: d.use = True
S.cycles.max_bounces = 10; S.cycles.glossy_bounces = 6; S.cycles.use_adaptive_sampling = True
w_, h_ = map(int, A.res.split('x')); S.render.resolution_x, S.render.resolution_y = w_, h_
try: S.view_settings.view_transform = 'AgX'; S.view_settings.look = 'AgX - Medium High Contrast' if not WHITE else 'AgX - Base Contrast'
except Exception: pass
S.render.image_settings.file_format = 'PNG'; S.render.image_settings.color_depth = '16' if A.anim == 0 else '8'
S.render.filepath = os.path.abspath(A.out)
if A.anim:
    S.frame_start, S.frame_end = 1, A.anim
    for ob, prop, (v0, v1) in anim:
        setattr(ob, prop, v0); ob.keyframe_insert(prop, frame=1); setattr(ob, prop, v1); ob.keyframe_insert(prop, frame=A.anim)
        for fc in ob.animation_data.action.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'BEZIER'; kp.easing = 'EASE_IN_OUT'
    bpy.ops.render.render(animation=True)
else:
    bpy.ops.render.render(write_still=True)
