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

## ⚙️ 환경 변수 설정 (필수)

이 애플리케이션은 **Vercel Serverless Functions**를 사용하여 YouTube API 키를 서버에서 안전하게 관리합니다.

### Vercel에서 환경 변수 설정하기

1. **Vercel 대시보드 접속**
   - [vercel.com/dashboard](https://vercel.com/dashboard)
   - 배포된 프로젝트 선택

2. **환경 변수 추가**
   - Settings → Environment Variables 메뉴로 이동
   - 다음 변수 추가:
     - **Key**: `YOUTUBE_API_KEY`
     - **Value**: 실제 YouTube Data API v3 키
     - **Environment**: Production, Preview, Development 모두 선택
   - "Save" 클릭

3. **재배포**
   - 환경 변수를 추가한 후 프로젝트를 재배포해야 적용됩니다
   - Deployments 탭 → 최신 배포 → "Redeploy" 클릭

### YouTube API 키 발급 방법

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 (또는 기존 프로젝트 선택)
3. "API 및 서비스" → "라이브러리" 메뉴
4. "YouTube Data API v3" 검색 후 활성화
5. "API 및 서비스" → "사용자 인증 정보" 메뉴
6. "사용자 인증 정보 만들기" → "API 키" 선택
7. 생성된 API 키를 복사하여 Vercel 환경 변수에 등록

## 🔒 보안 참고사항

- ✅ **API 키는 서버에서 관리됩니다** - 브라우저에 노출되지 않음
- ✅ **Serverless Function을 통한 안전한 API 호출**
- ⚠️ API 키는 절대 소스 코드에 직접 입력하지 마세요
- ⚠️ `.env` 파일은 Git에 커밋하지 마세요 (`.gitignore`에 추가)

## 📝 배포 후 확인사항

- [ ] 사이트가 정상적으로 로드되는지 확인
- [ ] Vercel 환경 변수에 `YOUTUBE_API_KEY`가 설정되었는지 확인
- [ ] 검색 기능이 정상 작동하는지 확인
- [ ] 필터 기능이 정상 작동하는지 확인
- [ ] Serverless Function이 정상적으로 동작하는지 확인 (`/api/search` 엔드포인트)

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

