// テスト用スクリプト: ログイン状態と認証をテスト
// ブラウザのコンソールで実行

async function testAuth() {
    console.log('🔍 認証状態テスト開始...');
    
    // 1. ローカルストレージの認証情報確認
    const authData = localStorage.getItem('sb-fcwostmctjnekjymfinv-auth-token');
    console.log('認証データ:', authData ? 'あり' : 'なし');
    
    // 2. API テスト
    try {
        const response = await fetch('/api/account/profile');
        const result = await response.json();
        console.log('プロフィールAPI結果:', result);
    } catch (error) {
        console.error('プロフィールAPIエラー:', error);
    }
    
    // 3. ポイント API テスト
    try {
        const response = await fetch('/api/account/points');
        const result = await response.json();
        console.log('ポイントAPI結果:', result);
    } catch (error) {
        console.error('ポイントAPIエラー:', error);
    }
    
    console.log('✅ テスト完了');
}

// 実行
testAuth();