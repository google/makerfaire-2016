from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import numpy as np
import argparse
import shutil
import sys

import tensorflow as tf

_CSV_COLUMNS = [
    'layer1', 'layer2', 'layer3', 'layer4', 'layer5', 'layer6', 'layer7', 'layer8', 'is_burger'
]

_CSV_COLUMN_DEFAULTS = [[''], [''], [''], [''], [''], [''], [''], [''], ['']]

parser = argparse.ArgumentParser()

parser.add_argument(
    '--model_dir', type=str, default='output',
    help='Base directory for the model.')

parser.add_argument(
    '--model_type', type=str, default='wide',
    help="Valid model types: {'wide', 'deep', 'wide_deep'}.")

parser.add_argument(
    '--train_epochs', type=int, default=1, help='Number of training epochs.')

parser.add_argument(
    '--epochs_per_eval', type=int, default=1,
    help='The number of training epochs to run between evaluations.')

parser.add_argument(
    '--batch_size', type=int, default=256, help='Number of examples per batch.')

parser.add_argument(
    '--train_data', type=str, default='xaa',
    help='Path to the training data.')

parser.add_argument(
    '--test_data', type=str, default='xab',
    help='Path to the test data.')



def input_fn(data_file, num_epochs, shuffle, batch_size):
  """Generate an input function for the Estimator."""
  assert tf.gfile.Exists(data_file), (
      '%s not found. Please make sure you have either run data_download.py or '
      'set both arguments --train_data and --test_data.' % data_file)

  def parse_csv(value):
    print('Parsing', data_file)
    columns = tf.decode_csv(value, record_defaults=_CSV_COLUMN_DEFAULTS)
    features = dict(zip(_CSV_COLUMNS, columns))
    labels = features.pop('is_burger')
    return features, tf.equal(labels, 'True')

  # Extract lines from input files using the Dataset API.
  dataset = tf.data.TextLineDataset(data_file)

  if shuffle:
    dataset = dataset.shuffle(buffer_size=100000000)
  dataset = dataset.map(parse_csv, num_parallel_calls=5)

  # We call repeat after shuffling, rather than before, to prevent separate
  # epochs from blending together.
  dataset = dataset.repeat(num_epochs)
  dataset = dataset.batch(batch_size)

  iterator = dataset.make_one_shot_iterator()
  features, labels = iterator.get_next()
  return features, labels

def build_model_columns():
  layer1 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer1', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer2 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer2', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer3 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer3', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer4 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer4', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer5 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer5', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer6 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer6', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer7 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer7', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])
  layer8 = tf.feature_column.categorical_column_with_vocabulary_list(
      'layer8', [
          'empty', 'crown', 'lettuce', 'tomato', 'cheese', 'patty', 'heel'])

  base_columns = [
      layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8
  ]

  crossed_columns = [
      # tf.feature_column.crossed_column(
      #     ['layer6', 'layer7', 'layer8'], hash_bucket_size=1000),
  ]

  wide_columns = base_columns + crossed_columns
  return wide_columns


def build_estimator(model_dir, model_type):
  """Build an estimator appropriate for the given model type."""
  wide_columns = build_model_columns()

  # Create a tf.estimator.RunConfig to ensure the model is run on CPU, which
  # trains faster than GPU for this model.
  run_config = tf.estimator.RunConfig().replace(
      session_config=tf.ConfigProto(device_count={'GPU': 0}))

  if model_type == 'wide':
    return tf.estimator.LinearClassifier(
        model_dir=model_dir,
        feature_columns=wide_columns,
        config=run_config)
  else:
    raise RuntimeError



def main(unused_argv):
  # Clean up the model directory if present
  shutil.rmtree(FLAGS.model_dir, ignore_errors=True)
  model = build_estimator(FLAGS.model_dir, FLAGS.model_type)

  # Train and evaluate the model every `FLAGS.epochs_per_eval` epochs.
  for n in range(FLAGS.train_epochs // FLAGS.epochs_per_eval):
    model.train(input_fn=lambda: input_fn(
        FLAGS.train_data, FLAGS.epochs_per_eval, True, FLAGS.batch_size),
                steps = 1000)

    results = model.evaluate(input_fn=lambda: input_fn(
        FLAGS.test_data, 1, False, FLAGS.batch_size))

    # Display evaluation metrics
    print('Results at epoch', (n + 1) * FLAGS.epochs_per_eval)
    print('-' * 60)

    for key in sorted(results):
      print('%s: %s' % (key, results[key]))

    new_samples = {
      'layer1': np.array([ 'cheese', 'cheese' ], dtype=str),
      'layer2': np.array([ 'cheese', 'cheese' ], dtype=str),
      'layer3': np.array([ 'cheese', 'cheese' ], dtype=str),
      'layer4': np.array([ 'cheese', 'cheese' ], dtype=str),
      'layer5': np.array([ 'cheese', 'cheese' ], dtype=str),
      'layer6': np.array([ 'cheese', 'crown' ], dtype=str),
      'layer7': np.array([ 'cheese', 'patty' ], dtype=str),
      'layer8': np.array([ 'cheese', 'heel' ], dtype=str),
      }
      
    predict_input_fn = tf.estimator.inputs.numpy_input_fn(
        x=new_samples,
        num_epochs=1,
        shuffle=False)

    predictions = list(model.predict(input_fn=predict_input_fn))
    print(predictions)


if __name__ == '__main__':
  tf.logging.set_verbosity(tf.logging.INFO)
  FLAGS, unparsed = parser.parse_known_args()
  tf.app.run(main=main, argv=[sys.argv[0]] + unparsed)