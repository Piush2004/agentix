"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
// @ts-expect-error Missing types for maath module
import * as random from 'maath/random/dist/maath-random.esm';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  UploadCloud,
  MessageSquare,
  LineChart,
  CheckCircle2,
  Wand2,
  BrainCircuit,
  Network,
  FileText,
  Building2,
  UserRound,
  ShieldCheck,
  Gauge,
  Users,
  Zap
} from 'lucide-react';

function GentleParticles(props: any) {
  const ref = useRef<THREE.Points>(null);

  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(3000 * 3), { radius: 2 });
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#4f46e5"
          size={0.008}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

const PIPELINE_FEATURES = [
  {
    icon: Wand2,
    title: 'Cleaning that shows its work',
    problem: 'Missing and messy data usually means hours of manual spreadsheet triage — or a model quietly trained on garbage.',
    solution: 'Agentix profiles every column, picks a statistically justified fix (median for skewed data, mode for categories) and tells you exactly what it changed and why.',
  },
  {
    icon: BrainCircuit,
    title: 'AutoML that picks the right model',
    problem: "Choosing between regression and classification, then the right algorithm, is where most self-serve tools quietly fall apart.",
    solution: 'Agentix detects the real shape of your problem, trains and validates on a proper held-out split, and reports real accuracy — not a placeholder number.',
  },
  {
    icon: LineChart,
    title: 'Explainability you can defend',
    problem: 'A model that can’t explain itself is a liability in front of a board, a regulator, or your own team.',
    solution: 'Every prediction comes with the drivers behind it in plain language, so you can stand behind the answer, not just the output.',
  },
  {
    icon: Network,
    title: 'A knowledge graph that remembers',
    problem: 'Insights from last quarter’s analysis usually die in someone’s downloads folder.',
    solution: 'Datasets, models, and experiments are linked automatically, so patterns you’ve already found surface again when they’re relevant.',
  },
  {
    icon: MessageSquare,
    title: 'An analyst who speaks plain English',
    problem: 'SQL and pivot tables are a real barrier between a question and an answer.',
    solution: 'Ask in your own words. Agentix answers grounded in your actual uploaded data — not a generic guess.',
  },
  {
    icon: FileText,
    title: 'Reports ready for the room',
    problem: 'Turning an analysis into something presentable eats up more time than the analysis itself.',
    solution: 'Board-ready executive summaries generate automatically, with the technical detail one click away for whoever needs it.',
  },
];

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="w-full bg-slate-50 overflow-x-hidden text-slate-900 font-sans selection:bg-indigo-500/30">

      {/* Scroll progress rail */}
      <motion.div
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-indigo-500 to-purple-500 z-[60]"
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 md:px-12 flex justify-between items-center z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="font-semibold text-xl flex items-center gap-2 text-indigo-600 tracking-tight">
          <Sparkles size={24} className="fill-indigo-100" />
          Agentix
        </div>
        <Link
          href="/login"
          className="px-5 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium shadow-sm text-sm"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <motion.div style={{ y: yBackground }} className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.8} />
            <GentleParticles />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.3}
            />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50"></div>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: opacityHero }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-4xl px-6 pointer-events-auto mt-12"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-sm font-medium tracking-wide">
            <Sparkles size={14} /> Agentix 2.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900">
            Enterprise Data Intelligence, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              without the complexity.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Upload your data and let the AI brain do the heavy lifting. Clean data, discover insights, and generate board-ready reports in seconds—no coding required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium text-[15px] hover:bg-indigo-700 hover:shadow-md hover:-translate-y-[1px] transition-all flex items-center gap-2"
            >
              Start for free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 z-10 flex flex-col items-center text-slate-400 animate-bounce"
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>

      {/* How it Works Section */}
      <section className="relative z-20 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">The AI Operating System for your data</h2>
          <p className="text-lg text-slate-500">From raw spreadsheet to strategic insight in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-slate-200"></div>

          <StepCard
            icon={UploadCloud}
            title="1. Connect Data"
            desc="Drag and drop your Excel or CSV files. The AI brain automatically cleans and structures the data."
            delay={0}
          />
          <StepCard
            icon={MessageSquare}
            title="2. Ask Questions"
            desc="Chat with your data using plain English. Agentix understands context and intent."
            delay={0.1}
          />
          <StepCard
            icon={LineChart}
            title="3. Discover Insights"
            desc="Get interactive charts, predictive modeling, and executive summaries instantly."
            delay={0.2}
          />
        </div>
      </section>

      {/* Feature Showcase: Chat demo */}
      <section className="relative z-20 py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Talk to your data naturally.</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              Forget complicated SQL queries or pivot tables. Agentix understands natural language. Whether you need a quick summary for a meeting or a deep dive into sales trends, just ask.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                'Zero coding required',
                'Instant chart generation',
                'Causal reasoning explanations'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 size={18} className="text-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200 bg-slate-50 shadow-xl p-6 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="flex flex-col gap-6 pt-2">
              <div className="self-end bg-slate-900 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-sm">
                Hey Agentix, what was our best selling product category in Q3?
              </div>
              <div className="flex gap-4 max-w-[90%]">
                <div className="w-8 h-8 rounded-md bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={16} className="text-indigo-600" />
                </div>
                <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm text-slate-700 text-sm leading-relaxed">
                  <p>In Q3, your best selling category was <strong>Enterprise Software</strong>, bringing in $42,500 in MRR.</p>
                  <div className="mt-4 w-full bg-slate-50 border border-slate-100 rounded-lg p-4">
                    <div className="flex items-end h-24 gap-3">
                      <div className="w-1/4 bg-slate-300 h-[40%] rounded-t-sm"></div>
                      <div className="w-1/4 bg-slate-400 h-[60%] rounded-t-sm"></div>
                      <div className="w-1/4 bg-indigo-500 h-[90%] rounded-t-sm shadow-sm"></div>
                      <div className="w-1/4 bg-slate-300 h-[50%] rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Full feature grid — what each part of the pipeline actually does */}
      <section className="relative z-20 py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 md:mb-20 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Every stage of the pipeline, handled.</h2>
          <p className="text-lg text-slate-500">Agentix isn&apos;t one trick — it&apos;s the full path from raw file to defensible decision, and each step is built to solve a specific, real problem.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PIPELINE_FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={(i % 3) * 0.08} />
          ))}
        </div>
      </section>

      {/* Enterprise vs Individual */}
      <section className="relative z-20 py-24 md:py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 md:mb-20 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">One platform. Two very different days.</h2>
            <p className="text-lg text-slate-400">Whether you&apos;re running analytics for a whole organization or just trying to understand your own spreadsheet, Agentix meets you where you are.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AudienceCard
              icon={Building2}
              eyebrow="For Enterprise"
              title="Analytics your whole org can trust."
              points={[
                { icon: ShieldCheck, text: 'Governed pipelines with a full audit trail of every cleaning decision and model result' },
                { icon: Users, text: 'Shared knowledge graph so every team builds on analysis that already exists, instead of starting over' },
                { icon: Gauge, text: 'Scales from a departmental spreadsheet to enterprise-sized datasets on the same workflow' },
              ]}
            />
            <AudienceCard
              icon={UserRound}
              eyebrow="For Individuals & Small Teams"
              title="A data scientist in your corner, on day one."
              points={[
                { icon: Zap, text: 'No setup, no infrastructure, no code — upload a file and get a real answer in minutes' },
                { icon: MessageSquare, text: 'Plain-English explanations by default, so you don’t need a statistics background to trust the result' },
                { icon: Sparkles, text: 'The same AutoML and explainability engine enterprises pay data teams for, sized for one person' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20 py-32 px-6 md:px-12 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Stop guessing. Start knowing.</h2>
        <p className="text-lg text-slate-600 mb-10 font-light">
          Whether you lead a data team or you are the data team, Agentix turns raw files into decisions you can stand behind.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium text-[15px] hover:bg-indigo-700 hover:shadow-md hover:-translate-y-[1px] transition-all"
        >
          Try Agentix Now <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-white">
        <div className="font-semibold text-lg flex items-center gap-2 mb-4 md:mb-0 text-slate-900 tracking-tight">
          <Sparkles size={20} className="text-indigo-600" />
          Agentix
        </div>
        <div className="text-slate-500 text-sm font-medium">
          &copy; 2026 Agentix AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function StepCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5 }}
      className="relative flex flex-col items-center text-center group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 relative z-10 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
        <Icon size={28} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-light text-[15px]">
        {desc}
      </p>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, problem, solution, delay }: { icon: any, title: string, problem: string, solution: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
    >
      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-5 shadow-sm">
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-light mb-3">
        <span className="text-slate-400">The problem: </span>{problem}
      </p>
      <p className="text-slate-700 text-sm leading-relaxed">
        {solution}
      </p>
    </motion.div>
  );
}

function AudienceCard({ icon: Icon, eyebrow, title, points }: { icon: any, eyebrow: string, title: string, points: { icon: any, text: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-sm"
    >
      <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mb-6">
        <Icon size={22} className="text-indigo-300" />
      </div>
      <div className="text-indigo-300 text-sm font-semibold tracking-wide uppercase mb-3">{eyebrow}</div>
      <h3 className="text-2xl font-bold mb-6 tracking-tight text-white">{title}</h3>
      <ul className="space-y-4">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-300 text-[15px] leading-relaxed">
            <point.icon size={18} className="text-indigo-400 mt-0.5 shrink-0" />
            {point.text}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
