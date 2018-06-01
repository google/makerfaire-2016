#!/bin/sh
MODELS_RESEARCH_DIR=/opt/tensorflow_models/research
export PYTHONPATH=$MODELS_RESEARCH_DIR:$MODELS_RESEARCH_DIR/slim
python $MODELS_RESEARCH_DIR/object_detection/train.py \
       --pipeline_config_path=gs://seventh-oven-198801-object-detector-train/models/model/faster_rcnn_resnet101_burgers.config \
       --train_dir=gs://seventh-oven-198801-object-detector-train/models/train