# Trace of Thought

책 · 논문 · 시도 · 회고를 한곳에 기록하는 개인 블로그.
👉 https://www.gaeng02.com

- **Stack**: Next.js 14 (App Router) · 정적 export(`output: 'export'`) · GitHub Pages 배포
- **카테고리**: Book(책) · Paper(논문) · Try Tech(기술) · Memoir(회고)
- 라이트/다크 모드 · 사이트 검색 · 시리즈 · 태그 · SEO 메타/사이트맵/JSON-LD

---

## 로컬 실행

```bash
npm install     # 최초 1회
npm run dev     # http://localhost:3000
```

`npm run dev` 는 콘텐츠 색인(`series.json` · `search-index.json`)을 먼저 생성한 뒤 개발 서버를 띄웁니다.

## 글 작성 (로컬 전용 Admin)

```
http://localhost:3000/admin
```

- 메타 입력 + Markdown 작성 + 실시간 미리보기, **Publish** 시 `content/<카테고리>/<날짜>-<slug>.md` 자동 생성
- 이미지는 에디터에 **드래그 / 붙여넣기**하면 `public/assets/images/` 에 저장되고 본문에 자동 삽입
- Admin(`src/app/admin`, `src/app/api`)은 **로컬 `next dev`에서만 동작하는 글쓰기 도구**입니다. 저장소엔 포함(백업)되지만 **배포(정적 빌드) 때는 자동 제외**됩니다. 자세한 사용법은 [`ADMIN.md`](./ADMIN.md) 참고.

## 빌드

평소엔 **직접 빌드할 필요가 없습니다.** main에 push하면 GitHub Actions가 빌드·배포합니다 (아래 *배포* 참고).

로컬에서 결과물을 직접 만들거나 미리보기하고 싶을 때:

```bash
npm run build:local   # 정적 사이트를 ./out 에 빌드
npm run preview       # ./out 을 로컬에서 미리보기 (http://localhost:3000)
```

> ⚠️ 로컬에서는 `npm run build` 대신 **`npm run build:local`** 을 쓰세요.
> 정적 export(`output: 'export'`)는 API 라우트와 공존할 수 없는데, 로컬에는 Admin용 `/api` 가 있기 때문입니다.
> `build:local` 은 빌드 동안 로컬 전용 `admin`·`api` 를 잠시 옮겼다가 끝나면 자동 복원합니다.
> (CI에는 이 폴더들이 없으므로 CI는 그냥 `npm run build` 를 씁니다.)

## 배포

```bash
git add .                 # 새 글(.md) + 이미지(public/assets/images) 등
git commit -m "post: ..."
git push                  # → GitHub Actions가 빌드 후 GitHub Pages에 배포
```

생성 산출물(`search-index.json`)은 `.gitignore` 되며 CI가 다시 만듭니다. `admin`/`api`는 커밋되지만 CI 빌드 단계에서 제거된 뒤 빌드됩니다(`deploy.yml`).
혼자 한 PC에서만 작업한다면 push 전 `git pull` 은 필요 없습니다(다른 PC·웹에서 main을 바꿨다면 필요).

## 구조

```
content/                 글 (Markdown + frontmatter)
  book-reviews/ paper-reviews/ try-tech/ memoir/
  series.config.json     시리즈 정의 (태그 기반)
data/about.json          About 페이지 데이터
public/assets/images/    이미지
src/app/                 라우트 (App Router)
src/components/           UI 컴포넌트
src/lib/                 콘텐츠·검색·SEO 유틸
scripts/                 색인·사이트맵 생성
```

### 환경 변수 (선택)

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics(GA4) 측정 ID. GitHub repo의 *Settings → Secrets and variables → Actions* 에 설정하면 배포 시 적용됩니다. (없으면 GA 비활성)
