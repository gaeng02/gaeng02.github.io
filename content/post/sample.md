---
title: "Post 작성 방법 가이드"
description: "Post 카테고리에 글을 작성하는 방법을 설명하는 샘플입니다."
date: "2024-01-15"
tags: ["가이드", "샘플"]
image: "image/sample-post.jpg"
---

# Post 작성 방법

이 파일은 Post 카테고리에 글을 작성하는 방법을 보여주는 샘플입니다.

## Frontmatter 구조

Post 파일의 맨 위에는 반드시 다음과 같은 frontmatter가 있어야 합니다:

```yaml
---
title: "글 제목"
description: "글에 대한 간단한 설명"
date: "YYYY-MM-DD"
tags: ["태그1", "태그2", "태그3"]
image: "image/이미지파일명.jpg" (선택사항)
---
```

### Frontmatter 필드 설명

- **title**: 글의 제목 (필수)
- **description**: 글에 대한 간단한 설명 (필수)
- **date**: 작성 날짜 (필수, YYYY-MM-DD 형식)
- **tags**: 관련 태그들 (선택사항, 배열 형태)
- **image**: 대표 이미지 (선택사항, content/post/image/ 폴더에 저장)

## 본문 작성

Frontmatter 아래부터는 일반적인 마크다운 문법을 사용하여 글을 작성합니다.

### 제목 사용법

```markdown
# 제목 1
## 제목 2
### 제목 3
```

### 강조와 링크

```markdown
**굵은 글씨**
*기울임 글씨*
`코드`

[링크 텍스트](URL)
```

### 코드 블록

```javascript
function example() {
    console.log("Hello, World!");
}
```

### 목록

- 순서 없는 목록
- 두 번째 항목
  - 들여쓰기된 항목

1. 순서 있는 목록
2. 두 번째 항목
3. 세 번째 항목

## 파일 저장 위치

Post 파일들은 `content/post/` 폴더에 저장해야 합니다.

예시:
- `content/post/my-first-post.md`
- `content/post/development-tips.md`
- `content/post/learning-notes.md`

## 이미지 사용

이미지를 사용하려면:

1. `content/post/image/` 폴더에 이미지 파일을 저장
2. Frontmatter의 `image` 필드에 경로 지정
3. 본문에서도 마크다운 문법으로 이미지 삽입 가능


## 주의사항

- 파일명은 영문 소문자와 하이픈(-) 사용 권장
- Frontmatter는 반드시 파일 맨 위에 위치
- Frontmatter와 본문 사이에 빈 줄 필요
- UTF-8 인코딩으로 저장

이제 이 샘플을 참고하여 Post를 작성해보세요!
