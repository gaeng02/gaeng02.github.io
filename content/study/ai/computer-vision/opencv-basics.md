---
title: "OpenCV 기초 학습"
date: "2024-01-15"
tags: ["Computer Vision", "OpenCV", "Python", "AI"]
description: "OpenCV 라이브러리를 사용한 컴퓨터 비전 기초 학습"
---

# OpenCV 기초 학습

## 개요
OpenCV(Open Source Computer Vision Library)는 실시간 컴퓨터 비전을 위한 라이브러리입니다. 이미지 처리, 객체 감지, 얼굴 인식 등 다양한 컴퓨터 비전 작업을 수행할 수 있습니다.

## 설치 방법

```bash
pip install opencv-python
pip install opencv-contrib-python  # 추가 기능 포함
```

## 기본 이미지 처리

### 이미지 읽기
```python
import cv2
import numpy as np

# 이미지 읽기
img = cv2.imread('image.jpg')

# 그레이스케일로 읽기
gray = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)
```

### 이미지 표시
```python
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

## 기본 필터링

### 블러 필터
```python
# 가우시안 블러
blur = cv2.GaussianBlur(img, (15, 15), 0)

# 중간값 블러
median = cv2.medianBlur(img, 5)
```

### 엣지 감지
```python
# Canny 엣지 감지
edges = cv2.Canny(img, 100, 200)
```

## 색상 공간 변환

```python
# BGR to RGB
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# BGR to HSV
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# BGR to Gray
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
```

## 실습 예제

### 웹캠에서 실시간 영상 처리
```python
import cv2

# 웹캠 캡처
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # 그레이스케일 변환
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # 엣지 감지
    edges = cv2.Canny(gray, 100, 200)
    
    # 결과 표시
    cv2.imshow('Original', frame)
    cv2.imshow('Edges', edges)
    
    # 'q' 키를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

## 다음 단계
- 객체 감지 (Haar Cascades, HOG)
- 얼굴 인식
- 이미지 세그멘테이션
- 딥러닝 모델과의 통합

## 참고 자료
- [OpenCV 공식 문서](https://docs.opencv.org/)
- [OpenCV Python 튜토리얼](https://docs.opencv.org/master/d6/d00/tutorial_py_root.html)
