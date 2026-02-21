export function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold">BookFlow</span>
            </div>
            <p className="text-white/70 text-sm">
              スマートな予約管理で、ビジネスを効率化。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">サービス</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>オンライン予約</li>
              <li>スケジュール管理</li>
              <li>顧客管理</li>
              <li>AI分析</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">お問い合わせ</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>support@bookflow.jp</li>
              <li>03-1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/50">
          &copy; 2026 BookFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
