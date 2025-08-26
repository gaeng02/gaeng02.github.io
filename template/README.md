# 글 작성 템플릿

이 폴더에는 각 글 타입별로 사용할 수 있는 템플릿 파일들이 있습니다.

## 템플릿 종류

### 1. Project Template (`project-template.md`)
프로젝트 글을 작성할 때 사용하는 템플릿입니다.

**사용 위치:** `content/projects/` 폴더

**주요 필드:**
- `title`: 프로젝트 제목
- `description`: 프로젝트 설명
- `date`: 작성일
- `period`: 프로젝트 기간
- `role`: 담당 역할
- `teamSize`: 팀 규모
- `achievements`: 주요 성과
- `image`: 프로젝트 이미지 경로
- `tags`: 관련 기술 태그

### 2. Post Template (`post-template.md`)
일반 포스트 글을 작성할 때 사용하는 템플릿입니다.

**사용 위치:** `content/posts/` 폴더

**주요 필드:**
- `title`: 포스트 제목
- `description`: 포스트 설명
- `date`: 작성일
- `tags`: 관련 태그 (회고 글의 경우 "회고" 태그 포함)
- `image`: 포스트 이미지 경로

### 3. Study Template (`study-template.md`)
스터디 글을 작성할 때 사용하는 템플릿입니다.

**사용 위치:** `content/study/` 폴더

**주요 필드:**
- `title`: 스터디 제목
- `description`: 스터디 설명
- `date`: 작성일
- `category`: 상위 카테고리 (Computer Science, AI, Web Development 등)
- `subcategory`: 하위 카테고리 (Algorithm, Database 등)
- `keywords`: 관련 키워드
- `image`: 스터디 이미지 경로

## 사용 방법

1. **템플릿 복사**
   ```bash
   cp template/project-template.md content/projects/새프로젝트.md
   cp template/post-template.md content/posts/새포스트.md
   cp template/study-template.md content/study/새스터디.md
   ```

2. **Frontmatter 수정**
   - 파일 상단의 `---` 사이에 있는 메타데이터를 수정
   - 각 필드에 맞는 정보 입력

3. **내용 작성**
   - 템플릿의 구조를 참고하여 내용 작성
   - 필요에 따라 섹션 추가/삭제 가능

4. **이미지 추가**
   - 이미지 파일을 `content/images/` 폴더에 저장
   - frontmatter의 `image` 필드에 경로 지정

## 주의사항

### 태그 규칙
- **회고 글**: 반드시 `tags`에 `"회고"` 포함
- **태그 형식**: 배열 형태로 작성 `["태그1", "태그2", "태그3"]`

### 파일명 규칙
- 영문 소문자와 하이픈(-) 사용
- 공백 대신 하이픈 사용
- 예: `my-new-project.md`, `react-hooks-guide.md`

### 카테고리 규칙
- **Computer Science**: Algorithm, Database, Operating System, Compiler, Network, Data Structure
- **AI**: Machine Learning, Deep Learning, Computer Vision, NLP, Reinforcement Learning
- **Web Development**: Frontend, Backend, Fullstack, DevOps

## 예시

### 회고 글 작성 예시
```yaml
---
title: "2024년 개발 회고"
description: "2024년 한 해 동안의 개발 경험과 배움"
date: "2024-12-31"
tags: ["회고", "2024", "개발경험"]
image: "image/2024-retrospect.jpg"
---
```

### 프로젝트 글 작성 예시
```yaml
---
title: "포트폴리오 웹사이트"
description: "React와 TypeScript를 사용한 개인 포트폴리오 웹사이트"
date: "2024-01-15"
period: "2024.01.01 - 2024.01.31"
role: "풀스택 개발자"
teamSize: "1명"
achievements: "반응형 디자인 구현, SEO 최적화, 성능 개선"
image: "image/portfolio.jpg"
tags: ["React", "TypeScript", "Node.js"]
---
```

## 자동 업데이트

글을 작성하고 GitHub에 푸시하면 GitHub Actions가 자동으로:
1. 새로운 글을 감지
2. JSON 파일 업데이트
3. 통계 데이터 업데이트
4. 웹사이트에 반영

따라서 별도의 수동 작업 없이 글 작성만 하면 됩니다.
