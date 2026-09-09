# Trace of Thought

책 · 논문 · 시도 · 회고를 기록하는 개인 블로그. 대표 주소: https://www.gaeng02.com

## 구성

이 저장소는 Next.js 정적 블로그이며 GitHub Pages에서 서비스합니다. 로그인·편집·파일 저장 API는 별도 [BlogStudio](https://github.com/gaeng02/BlogStudio) 저장소로 분리했습니다.

- 글 읽기: `https://www.gaeng02.com`
- 글 작성/수정: `https://www.gaeng02.com/studio` (BlogStudio 배포 및 경로 연결 후 사용)
- Google 로그인, 비공개 초안, 기존 글 수정, 이미지 업로드, GitHub 커밋 발행은 BlogStudio가 담당합니다.

## 개발과 빌드

```bash
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`build:local`은 `build`와 동일합니다. 빌드 중 관리자 디렉터리를 옮기거나 삭제할 필요가 없습니다. `main`에 push하면 GitHub Actions가 검사·빌드한 뒤 `out/`을 배포합니다.

## 콘텐츠 규칙

```yaml
---
title: 글 제목
date: "2026-09-09"
updatedAt: "2026-09-09T10:00:00+09:00"
description: 검색 결과에 표시할 글 설명
category: try-tech
tags: [태그1, 태그2]
---

Markdown 본문
```

`updatedAt`은 선택 사항이며 수정 발행 시 BlogStudio가 기록합니다. 새 글은 `content/<폴더>/<YYYY-MM-DD>-<slug>.md`로 저장합니다. 기존 파일명과 글 주소는 유지합니다. `draft: true`인 파일은 공개 페이지·검색 색인·시리즈·사이트맵에서 제외됩니다. 샘플 파일 3개는 이 설정으로 보존되어 있습니다.

| category | 폴더 | 공개 경로 |
| --- | --- | --- |
| book | book-reviews | /book/slug |
| paper | paper-reviews | /paper/slug |
| try-tech | try-tech | /try-tech/slug |
| memoir | memoir | /memoir/slug |

`lib/content.cjs`가 화면·색인·시리즈·사이트맵의 공통 로더입니다. 잘못된 필수 메타데이터나 중복 URL은 빌드를 실패시켜 누락을 드러냅니다. 한글 slug를 지원하며 과거 회고 URL `/memoir/2025-03-SWMaestro`도 유지합니다.

Markdown은 GFM을 지원하며 렌더링 결과를 정제합니다. 임의의 HTML/script는 허용하지 않습니다. 본문에 이미지를 넣을 때는 Markdown 문법을 사용합니다. 시리즈는 `content/series.config.json`에서 정의하고 태그로 글을 연결합니다.

## SEO

- 대표 주소·메타데이터 기준: `src/lib/site.ts`
- 전체 사이트맵: `/sitemap.xml` (글 포함)
- 기존 제출 주소 호환: `/sitemap-posts.xml`
- RSS: `/feed.xml`
- 수정일은 메타데이터·구조화 데이터·사이트맵에 적용하고 근거 없는 빌드 시각을 lastmod로 쓰지 않습니다.
- `/search`는 noindex를 적용하며 검색엔진이 해당 지시를 읽을 수 있도록 크롤링을 허용합니다.
- 본문과 글 목록의 링크는 정적 HTML로 생성됩니다. 전체 글은 `/archives`에서도 접근할 수 있습니다.

[SEO 점검 보고서](docs/SEO-AUDIT.md)를 참고하세요. HTTP에서 HTTPS로의 이동은 GitHub Pages/Cloudflare 설정에서 수정해야 합니다. Search Console의 색인·노출 데이터는 해당 계정에서 확인해야 합니다.

## 환경 변수

`NEXT_PUBLIC_GA_MEASUREMENT_ID`는 선택 사항입니다. GitHub 저장소의 Actions secret으로 설정하면 배포에 반영됩니다. Google 로그인 비밀값과 GitHub 발행 토큰은 이 공개 블로그 저장소에 넣지 않습니다.
