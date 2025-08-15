---
title: "Computer Vision 샘플"
description: "Computer Vision 관련 학습 자료입니다."
date: "2024-01-15"
tags: ["AI", "Computer Vision", "OpenCV"]
---

# Computer Vision 샘플

## 개요
Computer Vision 관련 학습 자료입니다.

## 주요 내용

### 1. 이미지 처리
- 이미지 필터링
- 엣지 검출
- 노이즈 제거

### 2. 객체 인식
- CNN (Convolutional Neural Network)
- YOLO (You Only Look Once)
- R-CNN

### 3. 얼굴 인식
- 얼굴 검출
- 얼굴 정렬
- 얼굴 인식

## 실습 예제

```python
import cv2
import numpy as np

# 이미지 로드
image = cv2.imread('sample.jpg')

# 그레이스케일 변환
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 엣지 검출
edges = cv2.Canny(gray, 50, 150)

# 결과 표시
cv2.imshow('Original', image)
cv2.imshow('Edges', edges)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

## 참고 자료
- OpenCV 공식 문서
- Computer Vision: Algorithms and Applications
- Deep Learning for Computer Vision
