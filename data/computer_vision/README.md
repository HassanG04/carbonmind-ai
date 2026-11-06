# Computer vision data

Purpose: equipment detection, classification and nameplate/OCR assistance.

The initial CarbonMind path is human-confirmed equipment onboarding. RGB images can suggest equipment candidates and readable specifications; they do not measure electricity, methane or other greenhouse gases directly.

Source links and download decisions are in `../large_data/download.txt`:

- YOLO pretrained weights: model artifact, link-only.
- COCO 2017: general object-detection baseline, link-only because the image archive is large.
- Open Images V7: broad object/category coverage, link-only because the image and annotation collection is very large.
- SUN RGB-D: optional depth-aware research, link-only.

Do not include people-focused or facial-recognition data. Do not infer electrical input watts from an object class alone.
