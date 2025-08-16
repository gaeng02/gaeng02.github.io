---
title: "TensorFlow 기초 학습"
date: "2024-01-20"
tags: ["Computer Vision", "TensorFlow", "Python", "AI", "Deep Learning"]
description: "TensorFlow를 사용한 컴퓨터 비전 기초 학습"
---

# TensorFlow 기초 학습

## 개요
TensorFlow는 Google에서 개발한 오픈소스 머신러닝 라이브러리입니다. 딥러닝 모델을 구축하고 훈련하는 데 널리 사용됩니다.

## 설치 방법

```bash
pip install tensorflow
pip install tensorflow-gpu  # GPU 지원 (선택사항)
```

## 기본 개념

### 텐서 (Tensor)
TensorFlow의 핵심 데이터 구조입니다.

```python
import tensorflow as tf

# 스칼라 (0차원 텐서)
scalar = tf.constant(5)

# 벡터 (1차원 텐서)
vector = tf.constant([1, 2, 3, 4, 5])

# 행렬 (2차원 텐서)
matrix = tf.constant([[1, 2], [3, 4]])

# 3차원 텐서
tensor_3d = tf.constant([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])
```

### 변수 (Variables)
학습 가능한 매개변수를 저장합니다.

```python
# 변수 생성
weights = tf.Variable(tf.random.normal([784, 10]))
bias = tf.Variable(tf.zeros([10]))

# 변수 초기화
tf.keras.backend.clear_session()
```

## 간단한 신경망 구축

### Sequential 모델

```python
import tensorflow as tf
from tensorflow import keras

# Sequential 모델 생성
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation='softmax')
])

# 모델 컴파일
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# 모델 요약
model.summary()
```

### 함수형 API

```python
# 입력 레이어
inputs = keras.Input(shape=(784,))

# 은닉 레이어
x = keras.layers.Dense(128, activation='relu')(inputs)
x = keras.layers.Dropout(0.2)(x)
x = keras.layers.Dense(64, activation='relu')(x)
x = keras.layers.Dropout(0.2)(x)

# 출력 레이어
outputs = keras.layers.Dense(10, activation='softmax')(x)

# 모델 생성
model = keras.Model(inputs=inputs, outputs=outputs)
```

## 이미지 분류 예제

### CNN 모델 구축

```python
# CNN 모델
model = keras.Sequential([
    keras.layers.Conv2D(32, 3, activation='relu', input_shape=(28, 28, 1)),
    keras.layers.MaxPooling2D(),
    keras.layers.Conv2D(64, 3, activation='relu'),
    keras.layers.MaxPooling2D(),
    keras.layers.Conv2D(64, 3, activation='relu'),
    keras.layers.Flatten(),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
```

### 데이터 전처리

```python
# MNIST 데이터셋 로드
(train_images, train_labels), (test_images, test_labels) = keras.datasets.mnist.load_data()

# 데이터 정규화
train_images = train_images.reshape((60000, 28, 28, 1)).astype('float32') / 255
test_images = test_images.reshape((10000, 28, 28, 1)).astype('float32') / 255

# 모델 훈련
history = model.fit(
    train_images, train_labels, 
    epochs=5, 
    validation_data=(test_images, test_labels)
)
```

## 모델 저장 및 로드

```python
# 모델 저장
model.save('my_model.h5')

# 모델 로드
loaded_model = keras.models.load_model('my_model.h5')

# 예측
predictions = loaded_model.predict(test_images[:5])
```

## 시각화

### 훈련 과정 시각화

```python
import matplotlib.pyplot as plt

# 훈련 히스토리 시각화
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()
```

## 다음 단계
- 전이 학습 (Transfer Learning)
- 데이터 증강 (Data Augmentation)
- 하이퍼파라미터 튜닝
- 모델 최적화

## 참고 자료
- [TensorFlow 공식 문서](https://www.tensorflow.org/)
- [TensorFlow 튜토리얼](https://www.tensorflow.org/tutorials)
- [Keras 가이드](https://keras.io/guides/)
