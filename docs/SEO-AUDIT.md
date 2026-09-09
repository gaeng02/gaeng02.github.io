# 공개 블로그 SEO 점검

점검일: 2026-09-09 (KST). 대상: `gaeng02.github.io` 저장소와 공개 HTTP 응답.

아래는 변경 전 공개 사이트의 관찰 결과와 수정 제안이다. 이후 콘텐츠 로더 통합, 샘플 초안 처리, 사이트맵·수정일 개선, 관리자 코드 분리를 로컬 코드에 구현했다. 공개 배포와 GitHub Pages/Cloudflare 서비스 설정 변경은 아직 하지 않았다. Google Search Console에는 접근하지 않았으므로 실제 Google 색인 제외 사유, 노출수, 검색 순위는 확인하지 못했다.

## 확인된 상태

| 항목 | 관찰 결과 | 의미 / 제안 |
| --- | --- | --- |
| 대표 주소 | 코드, CNAME, canonical, 사이트맵이 `https://www.gaeng02.com`을 가리킴 | 현재 대표 주소를 유지한다면 이 설정은 서로 일치한다. |
| HTTPS 리다이렉트 | `https://gaeng02.github.io/` → `301 Location: http://www.gaeng02.com/` → `200` | HTTPS에서 HTTP로 이동한다. GitHub Pages의 Enforce HTTPS와 Cloudflare의 HTTPS 리다이렉트 설정을 확인해야 한다. 코드 수정만으로 고칠 수 없는 운영 설정이다. |
| HTTPS 접속 | `https://www.gaeng02.com/`도 `200` | HTTP와 HTTPS가 모두 페이지를 제공한다. HTTP를 같은 경로의 HTTPS로 영구 이동시키는 구성을 권장한다. |
| HTML 본문 | 공개 회고 글의 본문과 H1이 초기 HTML에 존재 | 본문을 표시하기 위해 검색엔진의 JavaScript 실행이 반드시 필요한 상태는 아니다. |
| 페이지 메타 | 홈과 회고 글에 title, description, 자기 URL을 가리키는 canonical, index/follow가 존재 | 메타데이터가 전혀 없거나 사이트 전체가 noindex인 문제는 확인되지 않았다. |
| 공개 콘텐츠 | 글 사이트맵에 4편. 그중 책·논문·기술 글 3편의 제목은 `sample`, 설명은 `sample file`, 본문은 `sample` | 실질적인 검색 대상 콘텐츠가 적다. 샘플 파일은 보존하면서 초안 처리하여 공개 목록·검색 색인·사이트맵·정적 페이지에서 함께 제외하는 방안을 제안한다. |
| 사이트맵 | 기본 사이트맵은 고정 페이지·시리즈만, 별도 사이트맵은 글 포함. robots.txt가 둘 다 안내 | 현재 글이 사이트맵에서 완전히 누락된 것은 아니다. 다만 코드가 중복되어 앞으로 누락·불일치가 생길 수 있다. |
| lastmod | 고정 페이지·시리즈는 매 빌드 시각으로 변경됨 | 실제 콘텐츠 수정과 관계없이 날짜가 바뀐다. 근거가 없는 lastmod는 생략하고 글에는 실제 수정일을 쓰는 편이 정확하다. |
| 글 수정일 | BlogPosting의 dateModified가 항상 발행일과 같음 | 기존 글 수정 시 실제 수정일을 기록하여 메타데이터·구조화 데이터·사이트맵에 함께 적용하도록 제안한다. |
| 글 해석 코드 | 화면은 gray-matter, 일부 생성 스크립트는 정규식으로 frontmatter 해석 | YAML의 따옴표·날짜 형식·태그 표기에 따라 화면, 시리즈, 사이트맵 결과가 달라질 수 있다. 공통 콘텐츠 로더와 필수 필드·중복 URL 검증을 제안한다. |
| 검색 페이지 | `/search`에 noindex가 있으면서 robots.txt에서도 크롤링 차단 | 크롤링을 막으면 검색엔진이 noindex 지시를 읽을 수 없다. noindex를 유지하고 크롤링은 허용하는 방안을 제안한다. |
| 기존 글 URL | `/memoir/2025-03-SWMaestro`가 공개 중 | 분리·리팩토링 시 이 URL을 유지해야 한다. |

## 추가 구조 점검

- 현재 관리자 화면과 파일 저장 API는 로컬 개발용이다. GitHub Actions는 정적 빌드 직전에 해당 디렉터리를 삭제한다. 공개 사이트에서 이 API가 실행 중이라고 확인한 것은 아니다.
- 별도 BlogStudio를 구축하면 공개 블로그에서 관리자 코드와 빌드 중 디렉터리를 옮기거나 삭제하는 절차를 제거할 수 있다.
- 구조화 데이터의 JSON은 HTML 안에 삽입할 때 `<`를 이스케이프해야 한다. Markdown도 현재 `sanitize: false`이며, 새 에디터의 미리보기 및 공개 렌더링 정책을 맞춰야 한다.
- 검색 결과 개선은 기술 수정만으로 보장할 수 없다. 실제 글의 주제·본문 품질과 Search Console의 페이지별 색인 상태 확인이 함께 필요하다.

## 배포 후 확인할 항목

1. HTTP → HTTPS 이동과 기존 글 URL 응답을 확인한다.
2. 새 사이트맵에 발행된 글이 빠짐없이 포함되는지 확인한다.
3. Search Console에서 대표 도메인의 소유권을 확인하고 사이트맵을 제출한다. 저장소에 Google 확인 HTML은 있으나 소유권 확인 완료 여부는 확인하지 못했다.
4. URL 검사에서 회고 글의 Google 선택 canonical과 색인 제외 사유를 확인한다.
5. 수정 후 노출수·클릭수 추이를 관찰한다. 색인·순위 반영 시점은 보장할 수 없다.

## 근거

- 실제 공개 응답: [블로그](https://www.gaeng02.com/), [회고 글](https://www.gaeng02.com/memoir/2025-03-SWMaestro), [robots.txt](https://www.gaeng02.com/robots.txt), [기본 사이트맵](https://www.gaeng02.com/sitemap.xml), [글 사이트맵](https://www.gaeng02.com/sitemap-posts.xml).
- Google: [대표 URL 통합](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [사이트맵 작성 및 제출](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [JavaScript SEO와 noindex](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
