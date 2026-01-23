---
title: "Attention Is All You Need - Transformer 아키텍처"
date: "2026-01-20"
description: "Transformer 아키텍처를 제안한 논문을 리뷰합니다."
category: "paper"
tags: ["Transformer", "NLP", "Attention"]
featured: true
draft: false
---

# Attention Is All You Need

이 논문은 2017년에 발표된 것으로, Transformer 아키텍처를 제안했습니다. 이는 현재 대부분의 최신 NLP 모델의 기반이 되었습니다.

## 핵심 아이디어

### Self-Attention Mechanism

기존의 RNN이나 CNN을 사용하지 않고, **Self-Attention** 메커니즘만으로 시퀀스를 처리합니다.

### Multi-Head Attention

여러 개의 attention head를 병렬로 사용하여 다양한 관점에서 정보를 추출합니다.

## 아키텍처

### Encoder-Decoder 구조

- **Encoder**: 입력 시퀀스를 처리
- **Decoder**: 출력 시퀀스를 생성

### 주요 구성 요소

1. **Positional Encoding**: 순서 정보 제공
2. **Multi-Head Self-Attention**: 병렬 attention
3. **Feed-Forward Networks**: 포인트별 변환
4. **Layer Normalization**: 안정적인 학습

## 성과

- 기계 번역에서 SOTA 달성
- 학습 속도 향상 (병렬 처리 가능)
- 장거리 의존성 모델링 개선

## 영향

이 논문은 BERT, GPT 등 수많은 후속 모델의 기반이 되었습니다.
