---
title: "OpenCV 기초 학습"
description: "OpenCV 라이브러리를 사용한 컴퓨터 비전 기초 학습"
date: "2024-01-15"
author: "Gaeng02"
readingTime: "10"
tags: "opencv,computer-vision,python"
---

# OpenCV 기초 학습

## 개요

OpenCV(Open Source Computer Vision Library)는 컴퓨터 비전과 머신러닝을 위한 오픈소스 라이브러리입니다.

## 설치 방법

```bash
pip install opencv-python
```

## 기본 사용법

### 이미지 읽기

```python
import cv2

# 이미지 읽기
img = cv2.imread('image.jpg')

# 이미지 표시
cv2.imshow('Image', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

### 이미지 저장

```python
# 이미지 저장
cv2.imwrite('output.jpg', img)
```

## 주요 기능

### 1. 이미지 처리
- 필터링
- 변환
- 색상 공간 변환

### 2. 특징점 검출
- SIFT
- SURF
- ORB

### 3. 객체 검출
- Haar Cascade
- HOG
- 딥러닝 기반

## 예제 코드

```python
import cv2
import numpy as np

# 카메라 캡처
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    
    # 그레이스케일 변환
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # 엣지 검출
    edges = cv2.Canny(gray, 50, 150)
    
    # 결과 표시
    cv2.imshow('Original', frame)
    cv2.imshow('Edges', edges)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

## 결론

OpenCV는 컴퓨터 비전 분야에서 가장 널리 사용되는 라이브러리 중 하나입니다. 기본적인 이미지 처리부터 고급 머신러닝 기능까지 다양한 기능을 제공합니다.
