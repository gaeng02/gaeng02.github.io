---
title: "RAG (Retrieval-Augmented Generation) 기초"
date: "2026-01-18"
description: "RAG의 기본 개념과 동작 원리를 정리합니다."
category: "try-tech"
topic: "ai"
subtopic: "nlp"
tags: ["RAG", "Embedding", "LLM"]
featured: true
draft: false
---

##### RAG (Retrieval-Augmented Generation) 기초

RAG는 대규모 언어 모델(LLM)에 외부 지식을 결합하는 방법입니다.

## RAG란?

**Retrieval-Augmented Generation**은 다음과 같이 동작합니다:

1. **Retrieval**: 질문과 관련된 문서를 벡터 DB에서 검색
2. **Augmentation**: 검색된 문서를 컨텍스트로 추가
3. **Generation**: LLM이 컨텍스트를 바탕으로 답변 생성

## 왜 RAG가 필요한가?

### LLM의 한계

- 학습 시점 이후의 정보 부족
- 도메인 특화 지식 부족
- 환각(Hallucination) 문제

### RAG의 장점

- 최신 정보 활용 가능
- 도메인 특화 지식 통합
- 더 정확한 답변 생성

## 구현 단계

### 1. 문서 임베딩

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(documents)
```

### 2. 벡터 검색

질문을 임베딩하여 유사한 문서를 검색합니다.

### 3. 프롬프트 구성

검색된 문서를 컨텍스트로 포함하여 LLM에 전달합니다.

## 활용 사례

- 챗봇
- 질의응답 시스템
- 문서 요약
- 코드 검색

## 결론

RAG는 LLM의 한계를 보완하고 실용적인 AI 애플리케이션을 만드는 핵심 기술입니다.
