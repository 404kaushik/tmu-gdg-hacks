import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, 
  Wand2, 
  Volume2, 
  FileText, 
  Download, 
  Play, 
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Wand2,
      title: 'AI Script Generation',
      description: 'Generate engaging video scripts from simple prompts using advanced AI models.',
      color: 'bg-blue-500',
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Convert your scripts into natural-sounding narration with AI voices.',
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      title: 'Dynamic Overlays',
      description: 'Add professional text overlays that sync perfectly with your content.',
      color: 'bg-purple-500',
    },
    {
      icon: Video,
      title: 'Video Processing',
      description: 'High-quality video processing that maintains original resolution.',
      color: 'bg-orange-500',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Upload Video',
      description: 'Choose your video file (MP4, MOV, AVI, MKV)',
    },
    {
      number: 2,
      title: 'Generate Script',
      description: 'Describe your content and let AI create the perfect script',
    },
    {
      number: 3,
      title: 'Add Audio',
      description: 'Convert script to natural-sounding narration',
    },
    {
      number: 4,
      title: 'Download',
      description: 'Get your enhanced video with overlays and audio',
    },
  ];

  const stats = [
    { label: 'Videos Processed', value: '1,000+' },
    { label: 'Processing Time', value: '< 5 min' },
    { label: 'User Rating', value: '4.9/5' },
    { label: 'Formats Supported', value: '4+' },
  ];

  /* ───────── sample community carousel (static) ───────── */
  const sampleVids = [
    { url:'https://dcuyywmc95nls.cloudfront.net/EN/2compress.mp4', views:'932.9K' },
    { url:'https://dcuyywmc95nls.cloudfront.net/EN/6compress.mp4', views:'12.2M' },
    { url:'https://dcuyywmc95nls.cloudfront.net/EN/4compress.mp4', views:'1.2M' },
    { url:'https://dcuyywmc95nls.cloudfront.net/EN/5compress.mp4', views:'1.5M' },
    { url:'https://home-vexub.s3.eu-west-3.amazonaws.com/EN/3compress.mp4', views:'230K' },
    { url:'https://dcuyywmc95nls.cloudfront.net/EN/1compress.mp4', views:'421K' }
  ];
  const duplicated = [...sampleVids, ...sampleVids];     // infinite-scroll illusion

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Transform Videos with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}AI Magic
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Generate scripts, add text overlays, and create AI narration for your videos. 
                Make your content more engaging and accessible with our powerful AI tools.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link
                  to="/process"
                  className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4 rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Processing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                
                <button className="btn-secondary inline-flex items-center justify-center text-lg px-8 py-4 rounded-xl">
                  <Video className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* ── community carousel ── */}
              <section className="community-section">
                <div className="video-carousel">
                  {duplicated.map((v, i) => (
                    <div key={i} className="video-card">
                      <video className="video-bg"
                            src={v.url}
                            muted
                            autoPlay
                            loop
                            playsInline />
                      <div className="video-card-content">
                        <div className="video-info">▷ {v.views}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional video content with AI assistance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your videos in just 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose VideoScriptify?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
                    <p className="text-gray-600">
                      Generate scripts and narration in minutes, not hours. Focus on creativity while AI handles the heavy lifting.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Quality</h3>
                    <p className="text-gray-600">
                      High-quality output that maintains your video's original resolution and adds professional touches.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
                    <p className="text-gray-600">
                      Intuitive interface designed for creators of all skill levels. No technical expertise required.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="mb-6">
                  <Video className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
                  <p className="text-blue-100">
                    Join thousands of creators who are already using VideoScriptify to enhance their content.
                  </p>
                </div>
                
                <Link
                  to="/process"
                  className="inline-flex items-center justify-center w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Your First Video
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 