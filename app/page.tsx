import Image from "next/image";
import Link from "next/link";
import FeatureCard from "@/app/components/FeatureCard";
import NewsCard from "@/app/components/NewsCard";
import EmployeeSection from "@/app/components/EmployeeSection";
import { newsArticles } from "@/app/data/news";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden bg-mccain-dark">
        {/* Background image with modern treatment */}
        <Image
          src="https://www.mccain.com/media/4484/home-page-image.jpg"
          alt="We are McCain"
          fill
          className="object-cover scale-105 animate-[heroZoom_20s_ease-in-out_infinite_alternate]"
          priority
        />

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-mccain-green/30 via-transparent to-transparent" />

        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mccain-green via-mccain-yellow to-mccain-green" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              {/* Eyebrow tag */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-mccain-yellow rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-white/90 uppercase tracking-widest">
                  Global Leader in Frozen Foods
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
                We are
                <br />
                <span className="relative inline-block">
                  McCain
                  <span className="text-mccain-yellow text-7xl md:text-8xl lg:text-9xl leading-none">.</span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-md leading-relaxed font-light">
                Celebrating real connections through delicious, planet-friendly food &mdash; in over{" "}
                <span className="text-mccain-yellow font-semibold">160 countries</span> worldwide.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://careers.mccain.com/"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 bg-mccain-yellow hover:bg-yellow-400 text-mccain-dark font-bold px-8 py-4 rounded-lg transition-all text-sm uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Join Our Team
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-lg transition-all text-sm uppercase tracking-wide hover:-translate-y-0.5"
                >
                  Our Purpose
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stat bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { value: "$16B", label: "Global Revenue" },
                { value: "20K+", label: "Team Members" },
                { value: "160+", label: "Countries" },
                { value: "1 in 4", label: "Fries Worldwide" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 md:px-6 md:py-4 text-center"
                >
                  <p className="text-xl md:text-2xl font-bold text-mccain-yellow">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider mt-0.5 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="Our Business"
            subtitle="Famous for French fries and more!"
            description="Learn about our business & brand"
            image="https://www.mccain.com/media/4221/skins-on-french-fries.jpg"
            href="/about-us/our-business-brands"
          />
          <FeatureCard
            title="Careers"
            subtitle="Unlocking your potential"
            description="Discover exciting new career opportunities"
            image="https://www.mccain.com/media/3964/mccain-foods-team-member-at-a-conference.jpg"
            href="https://careers.mccain.com/"
          />
        </div>
      </section>

      {/* Hot Potato Podcast CTA */}
      <section className="bg-mccain-green">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-white">
            <h2 className="text-3xl md:text-4xl font-bold leading-snug">
              Check out our<br />
              &apos;Hot Potato&apos;<br />
              sustainability podcast<span className="text-mccain-yellow">.</span>
            </h2>
            <Link
              href="/sustainability"
              className="mt-6 inline-block bg-white text-mccain-green font-semibold px-8 py-3 rounded hover:bg-mccain-yellow hover:text-mccain-dark transition-colors text-sm"
            >
              Learn More
            </Link>
          </div>
          <div className="flex-1 relative h-[300px] md:h-[350px] w-full rounded-lg overflow-hidden">
            <Image
              src="https://www.mccain.com/media/4546/mccain_hot_potato_d.jpg"
              alt="Hot Potato Podcast"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Social Media & Sustainability Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="Social Media"
            subtitle="Keep up-to-date on our latest news"
            description="Follow @McCain Foods on LinkedIn"
            image="https://www.mccain.com/media/4222/holding-smartphone.jpg"
            href="https://www.linkedin.com/company/mccainfoods/"
          />
          <FeatureCard
            title="Sustainability"
            subtitle="For the generations to come"
            description="Our progress & commitments"
            image="https://www.mccain.com/media/4224/wind-turbine-in-field.jpg"
            href="/sustainability"
          />
        </div>
      </section>

      {/* Purpose Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="https://www.mccain.com/media/3834/farmer-holding-potatoes-header.png"
          alt="Celebrating real connections"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug max-w-lg">
              Celebrating<br />
              real connections<br />
              through delicious<br />
              planet-friendly food<span className="text-mccain-yellow">.</span>
            </h2>
            <Link
              href="/about-us"
              className="mt-6 inline-block bg-mccain-green hover:bg-mccain-green-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wide"
            >
              Learn About Our Purpose
            </Link>
          </div>
        </div>
      </section>

      {/* Customers & Food Cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="Customers"
            subtitle="Working in partnership for growth"
            description="Learn about foodservice and retail"
            image="https://www.mccain.com/media/3661/chef-cooking.jpg"
            href="/about-us/our-business-brands"
          />
          <FeatureCard
            title="Our Food"
            subtitle="Hear about our passion for food"
            description="Discover our delicious range of food"
            image="https://www.mccain.com/media/4225/cooked-potatoes.jpg"
            href="/about-us/our-passion-for-food"
          />
        </div>
      </section>

      {/* Career Stories CTA */}
      <section className="relative w-full h-[400px] md:h-[450px] overflow-hidden">
        <Image
          src="https://www.mccain.com/media/3840/career-stories-mccain-foods.png"
          alt="Career stories"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              Check out<br />
              career stories<br />
              from our teams<br />
              around the world<span className="text-mccain-yellow">.</span>
            </h2>
            <Link
              href="https://careers.mccain.com/"
              target="_blank"
              className="mt-6 inline-block bg-mccain-green hover:bg-mccain-green-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm"
            >
              Read now
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-mccain-dark mb-8">
          Latest News<span className="text-mccain-yellow">.</span>
        </h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {newsArticles.slice(0, 3).map((article) => (
            <NewsCard key={article.slug} {...article} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/information-centre/news"
            className="inline-block bg-mccain-green hover:bg-mccain-green-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm"
          >
            Information Centre
          </Link>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="bg-mccain-gray">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-mccain-dark leading-snug">
              Discover more about<br />
              McCain on Instagram<span className="text-mccain-yellow">.</span>
            </h2>
            <a
              href="https://www.instagram.com/mccainglobal/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-mccain-green hover:bg-mccain-green-dark text-white font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wide"
            >
              Follow @McCainGlobal on Instagram
            </a>
          </div>
          <div className="flex-1 relative h-[280px] w-full rounded-lg overflow-hidden">
            <Image
              src="https://www.mccain.com/media/3936/follow-mccain-foods-on-linkedin.jpeg"
              alt="Follow McCain on Instagram"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* "I would like to know about..." FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-mccain-dark mb-8">
          I would like to know about...
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { q: "What is it like to work at McCain Foods?", href: "/about-us" },
            { q: "How do I make a job application?", href: "https://careers.mccain.com/" },
            { q: "How do I contact McCain Foods?", href: "/contact" },
            { q: "How do I find other McCain websites?", href: "/information-centre/news" },
            { q: "How do I find McCain social media?", href: "/information-centre/news" },
            { q: "Who is your CEO & Board?", href: "/about-us/our-leadership" },
            { q: "How do I become a Grower/Farmer?", href: "/about-us" },
          ].map((item) => (
            <Link
              key={item.q}
              href={item.href}
              className="block p-4 bg-mccain-gray rounded-lg text-sm font-medium text-mccain-dark hover:bg-mccain-green hover:text-white transition-colors"
            >
              {item.q}
            </Link>
          ))}
        </div>

        {/* Audience Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "For customers", icon: "https://www.mccain.com/media/3861/foodservice-icon-for-com.png", href: "/about-us/our-business-brands" },
            { label: "For candidates", icon: "https://www.mccain.com/media/3863/career-icon-for-com.png", href: "https://careers.mccain.com/" },
            { label: "For journalists & media", icon: "https://www.mccain.com/media/3859/journalist-icon-for-com.png", href: "/information-centre/news" },
            { label: "For farmers & growers", icon: "https://www.mccain.com/media/4723/tractor-yellow-white-outline-3x-8.png", href: "/about-us" },
            { label: "For sustainability & community", icon: "https://www.mccain.com/media/3860/sustainability-icon-for-com.png", href: "/sustainability" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center text-center p-6 bg-mccain-green rounded-lg text-white hover:bg-mccain-green-dark transition-colors group"
            >
              <div className="relative w-12 h-12 mb-3">
                <Image src={item.icon} alt={item.label} fill className="object-contain brightness-0 invert" />
              </div>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Application Status - Applicant Listing */}
      <EmployeeSection />
    </>
  );
}
