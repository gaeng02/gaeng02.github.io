# Gaeng02's Blog

개발자로서의 여정을 기록하고 지식을 공유하는 개인 블로그입니다.

## 🚀 주요 기능

- **반응형 디자인**: 모든 디바이스에서 최적의 사용자 경험
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 변경
- **검색 기능**: 전체 콘텐츠 검색 (Ctrl+K 단축키 지원)
- **마크다운 지원**: 포스트 작성에 마크다운 사용
- **태그 시스템**: 프로젝트와 포스트 연결
- **카테고리 분류**: 프로젝트, 스터디, 포스트로 체계적 분류

## 📁 프로젝트 구조

```
gaeng02.github.io/
├── index.html              # 메인 페이지
├── posts/                  # 포스트 목록 페이지
├── projects/               # 프로젝트 페이지들
├── study/                  # 스터디 페이지들
├── content/                # 마크다운 콘텐츠
│   ├── posts/             # 일반 포스트
│   ├── projects/          # 프로젝트 포스트
│   └── study/             # 스터디 포스트
├── css/                   # 스타일시트
│   ├── main.css          # 메인 스타일
│   └── components.css    # 컴포넌트 스타일
├── js/                    # JavaScript 파일들
│   ├── main.js           # 메인 기능
│   ├── theme.js          # 테마 관리
│   ├── search.js         # 검색 기능
│   └── markdown.js       # 마크다운 처리
├── data/                  # JSON 데이터 (자동 생성)
├── scripts/               # 빌드 스크립트
└── package.json           # 프로젝트 설정
```

## ✍️ 마크다운 포스트 작성 방법

### 1. 포스트 생성

새로운 포스트를 작성하려면 `content/` 디렉토리 아래 적절한 폴더에 `.md` 파일을 생성하세요:

```bash
# 일반 포스트
content/posts/my-new-post.md

# 프로젝트 포스트
content/projects/my-project.md

# 스터디 포스트
content/study/javascript/async-await.md
```

### 2. Front Matter 작성

각 마크다운 파일의 맨 위에 메타데이터를 작성하세요:

```markdown
---
title: "포스트 제목"
slug: "post-slug"
date: "2024-01-15"
description: "포스트 설명"
tags: ["태그1", "태그2", "태그3"]
author: "Gaeng02"
---
```

### 3. 콘텐츠 작성

Front Matter 아래에 마크다운으로 콘텐츠를 작성하세요:

```markdown
# 제목

## 소제목

일반 텍스트...

### 코드 블록

```javascript
function hello() {
    console.log("Hello, World!");
}
```

### 목록

- 항목 1
- 항목 2
- 항목 3

### 링크

[링크 텍스트](https://example.com)
```

### 4. 프로젝트 태그 연결

프로젝트와 관련 포스트를 연결하려면 같은 태그를 사용하세요:

```markdown
# 프로젝트 파일 (portfolio-website.md)
---
tags: ["portfolio-website", "React", "TypeScript"]
---

# 관련 포스트 파일 (react-hooks-guide.md)
---
tags: ["React", "JavaScript", "portfolio-website"]
---
```


## 📞 연락처

- **GitHub**: [@gaeng02](https://github.com/gaeng02)
- **이메일**: sondin144@gmail.com
- **블로그**: [https://gaeng02.github.io](https://gaeng02.github.io)
