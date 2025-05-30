import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from '../components/Navbar';
import uploadIcon from '../assets/images/icons/upload.png';
import galleryIcon from '../assets/images/icons/gallery.png';
import communityIcon from '../assets/images/icons/community.png';
import art1 from '../assets/images/gallery/art1.jpg';
import art2 from '../assets/images/gallery/art2.jpg';
import art3 from '../assets/images/gallery/art3.jpg';
import trialImage from '../assets/images/courses/trial.jpg';
import formalImage from '../assets/images/courses/formal.jpg';


export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            お使いのブラウザは video タグに対応していません。
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />
          <div className="relative z-20 text-white">
            <h1 className="text-4xl md:text-5xl mb-4">未来へ繋がる、leafArtと共に</h1>
            <p className="text-lg font-extralight md:text-xl mb-6">
              ここでは、子どもたちの成長の一瞬一瞬を筆で記録し、彼らの世界を色彩で描き出します。
            </p>
            {!user && (
              <Link
                to="/register"
                className="text-xs inline-block bg-lime-500 text-white px-6 py-3 rounded-full hover:bg-lime-700 transition"
              >
                ログインまたは新規登録
              </Link>
            )}
          </div>
        </section>

        {/* Features */}
<section className="bg-white py-16 px-4 max-w-6xl mx-auto">
  <h2 className="text-3xl font-normal text-center text-gray-800 mb-12">
    leafArtについて
  </h2>
  <div className="grid md:grid-cols-3 gap-8">
    <Link to="/profile" className="transform hover:scale-105 transition duration-300">
      <div className="text-center p-4 rounded-lg hover:bg-lime-50 cursor-pointer">
        <img src={uploadIcon} alt="作品アップロード" className="mx-auto mb-4 w-16 h-16" />
        <h3 className="text-xl mb-2">簡単アップロード</h3>
        <p className="text-gray-600">
          お子さまのアート作品を手軽にアップロードし、すべての輝く瞬間を記録しましょう。
        </p>
      </div>
    </Link>

    <Link to="/gallery" className="transform hover:scale-105 transition duration-300">
      <div className="text-center p-4 rounded-lg hover:bg-lime-50 cursor-pointer">
        <img src={galleryIcon} alt="作品展示" className="mx-auto mb-4 w-16 h-16" />
        <h3 className="text-xl mb-2">作品展示</h3>
        <p className="text-gray-600">
          お子さまの芸術的な才能を披露し、成長の喜びを分かち合いましょう。
        </p>
      </div>
    </Link>

    {/* 画材购入卡片 */}
    <Link to="/products" className="transform hover:scale-105 transition duration-300">
      <div className="text-center p-4 rounded-lg hover:bg-lime-50 cursor-pointer">
        <img src={communityIcon} alt="画材購入" className="mx-auto mb-4 w-16 h-16" />
        <h3 className="text-xl mb-2">画材購入</h3>
        <p className="text-gray-600">
          必要な画材や道具をオンラインで購入できます。leafArtが厳選した安全・安心な画材をチェック！
        </p>
      </div>
    </Link>
  </div>
</section>


{/* ✅ Courses Section */}
<section className="bg-white py-16 px-4 max-w-6xl mx-auto">
  <h2 className="text-3xl font-normal text-center text-gray-800 mb-12">
    コース選択
  </h2>
  <div className="grid md:grid-cols-2 gap-8">
    {/* 体验课 */}
    <a
      href="/course-application?type=trial"
      className="block border rounded-xl overflow-hidden hover:shadow-lg transition"
    >
      <img src={trialImage} alt="体験レッスン" className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-normal mb-4 text-gray-800">体験レッスン</h3>
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            以下の方が対象です<br />
            年齢：3歳～17歳<br />
            人数：1人参加の方限定<br />
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">レッスン料 (60分)</span>
            <div className="text-2xl font-normal text-limegreen mt-1">2,000円</div>
          </div>
        </div>
      </div>
    </a>

    {/* 正式课 */}
    <a
      href="/course-application?type=formal"
      className="block border rounded-xl overflow-hidden hover:shadow-lg transition"
    >
      <img src={formalImage} alt="正式レッスン" className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-normal mb-4 text-gray-800">正式レッスン</h3>
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            以下の方が対象です<br />
            年齢：3歳～17歳<br />
            人数：1人参加の方限定<br />
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">レッスン料 (90分)</span>
            <div className="text-xl font-normal text-limegreen mt-1">
              金・日曜 <span className="text-2xl">2,500円</span><br />
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
</section>

        {/* Gallery */}
        <section className="bg-white py-16 px-4">
          <h2 className="text-3xl text-center text-gray-800 mb-12">セレクト作品</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <img src={art1} alt="作品1" className="rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer" />
            <img src={art2} alt="作品2" className="rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer" />
            <img src={art3} alt="作品3" className="rounded-lg shadow-md hover:scale-105 transform transition duration-300 cursor-pointer" />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 py-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} leafArt. All rights reserved.
        </footer>
      </main>
    </>
  );
}
