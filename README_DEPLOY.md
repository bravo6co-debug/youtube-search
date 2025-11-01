# 🚀 Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법입니다.

## 📋 사전 준비

1. **GitHub 계정** (또는 GitLab, Bitbucket)
2. **Vercel 계정** ([vercel.com](https://vercel.com)에서 무료 가입)
3. **프로젝트가 Git 저장소에 커밋되어 있어야 함**

## 🔧 배포 방법

### 방법 1: Vercel CLI 사용 (권장)

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **프로젝트 디렉토리에서 로그인**
   ```bash
   vercel login
   ```

3. **배포**
   ```bash
   vercel
   ```
   - 첫 배포 시 몇 가지 질문에 답변:
     - "Set up and deploy?": Y
     - "Which scope?": 본인 계정 선택
     - "Link to existing project?": N (처음 배포 시)
     - "Project name": 프로젝트 이름 입력 (또는 Enter로 기본값 사용)
     - "Directory": `./` (현재 디렉토리)

4. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

### 방법 2: GitHub 연동 (추천)

1. **GitHub에 프로젝트 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Vercel 웹사이트에서 배포**
   - [vercel.com](https://vercel.com) 접속
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정:
     - Framework Preset: "Other"
     - Root Directory: `./`
     - Build Command: (비워두기)
     - Output Directory: `./`
   - "Deploy" 클릭

3. **자동 배포**
   - 이후 Git에 푸시할 때마다 자동으로 재배포됩니다.

## ⚙️ 환경 변수 설정 (선택사항)

API 키를 환경 변수로 관리하려면:

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. 변수 추가:
   - Key: `YOUTUBE_API_KEY`
   - Value: 실제 API 키 값
   - Environment: Production, Preview, Development 모두 선택

3. `index.html`에서 환경 변수 사용하도록 수정 (필요시)

## 🔒 API 키 설정

배포 후 API 키를 설정하려면:

1. 배포된 사이트 접속
2. 브라우저 개발자 도구(F12) 열기
3. Console 탭에서 실행:
   ```javascript
   localStorage.setItem("youtube_api_key", "YOUR_API_KEY_HERE")
   ```
4. 페이지 새로고침

## 📝 배포 후 확인사항

- [ ] 사이트가 정상적으로 로드되는지 확인
- [ ] API 키가 로컬 스토리지에 저장되는지 확인
- [ ] 검색 기능이 정상 작동하는지 확인
- [ ] 필터 기능이 정상 작동하는지 확인

## 🔄 업데이트 배포

### CLI 사용 시
```bash
vercel --prod
```

### GitHub 연동 시
```bash
git add .
git commit -m "Update description"
git push
```
→ 자동으로 재배포됩니다.

## 🌐 커스텀 도메인 설정

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 가이드 따라하기

## 💡 참고사항

- Vercel은 정적 파일 호스팅이 무료입니다
- 배포는 즉시 반영됩니다
- 각 배포마다 고유한 URL이 생성됩니다
- GitHub 연동 시 Pull Request마다 Preview 배포가 자동 생성됩니다

