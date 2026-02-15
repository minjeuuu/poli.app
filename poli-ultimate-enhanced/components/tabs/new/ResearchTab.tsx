import React, { useState } from 'react';
import { BookOpen, FileText, BarChart3, Users, Target, Microscope, Database, Download, Share2, Sparkles, Search, Filter, ChevronRight, GraduationCap } from 'lucide-react';
import IntelligentSearch from '../IntelligentSearch';

interface Props {
    onNavigate: (type: string, payload: any) => void;
}

const RESEARCH_METHODOLOGIES = [
    {
        name: 'Qualitative Research',
        icon: Users,
        description: 'In-depth exploration of political phenomena through interviews, observations, and textual analysis',
        methods: ['Case Studies', 'Process Tracing', 'Ethnography', 'Discourse Analysis', 'Content Analysis', 'Focus Groups'],
        color: 'blue'
    },
    {
        name: 'Quantitative Research',
        icon: BarChart3,
        description: 'Statistical analysis of political data to identify patterns and test hypotheses',
        methods: ['Regression Analysis', 'Survey Research', 'Experimental Design', 'Time Series', 'Panel Data', 'Meta-Analysis'],
        color: 'green'
    },
    {
        name: 'Mixed Methods',
        icon: Microscope,
        description: 'Combining qualitative and quantitative approaches for comprehensive understanding',
        methods: ['Sequential Design', 'Concurrent Design', 'Embedded Design', 'Triangulation', 'Multi-Phase Design'],
        color: 'purple'
    },
    {
        name: 'Comparative Research',
        icon: Target,
        description: 'Systematic comparison across countries, regions, or time periods',
        methods: ['Most Similar Systems', 'Most Different Systems', 'Comparative Historical', 'Cross-National', 'Within-Case'],
        color: 'orange'
    }
];

const RESEARCH_TOOLS = [
    { name: 'Citation Generator', icon: FileText, desc: 'APA, MLA, Chicago, Harvard formats' },
    { name: 'Survey Designer', icon: Database, desc: 'Create and analyze political surveys' },
    { name: 'Statistical Calculator', icon: BarChart3, desc: 'Run regressions and correlations' },
    { name: 'Literature Review Matrix', icon: BookOpen, desc: 'Organize scholarly sources' },
    { name: 'Research Proposal Template', icon: GraduationCap, desc: 'Structure your research project' },
    { name: 'Data Visualization', icon: BarChart3, desc: 'Create charts and graphs' },
    { name: 'Coding Assistant', icon: Microscope, desc: 'Qualitative coding helper' },
    { name: 'Bibliography Manager', icon: Database, desc: 'Manage all your sources' }
];

const CITATION_STYLES = ['APA 7th', 'MLA 9th', 'Chicago 17th', 'Harvard', 'Vancouver', 'IEEE', 'Turabian', 'AMA'];

const RESEARCH_ETHICS = [
    'Informed Consent',
    'Confidentiality & Anonymity',
    'Avoiding Harm',
    'Institutional Review Board (IRB)',
    'Data Protection',
    'Conflict of Interest',
    'Plagiarism Prevention',
    'Research Integrity'
];

export default function ResearchTab({ onNavigate }: Props) {
    const [activeSection, setActiveSection] = useState<'overview' | 'methods' | 'tools' | 'ethics'>('overview');
    const [citationText, setCitationText] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('APA 7th');

    return (
        <div className="h-full bg-academic-bg dark:bg-stone-950 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white dark:bg-stone-900 rounded-xl">
                            <Microscope className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-academic-primary dark:text-white">Research Lab</h1>
                            <p className="text-sm text-academic-secondary dark:text-stone-400">Academic research tools & methodologies</p>
                        </div>
                    </div>
                    
                    <IntelligentSearch 
                        onSearch={(q) => {}} 
                        onNavigate={onNavigate}
                        placeholder="Search research methods, tools, or topics..."
                    />

                    <div className="flex gap-2 mt-4">
                        {[
                            { id: 'overview', label: 'Overview', icon: BookOpen },
                            { id: 'methods', label: 'Methodologies', icon: Microscope },
                            { id: 'tools', label: 'Tools', icon: BarChart3 },
                            { id: 'ethics', label: 'Ethics', icon: Users }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSection(tab.id as any)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                                        activeSection === tab.id
                                            ? 'bg-academic-accent text-white'
                                            : 'bg-stone-100 dark:bg-stone-800 text-academic-secondary hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* OVERVIEW */}
                    {activeSection === 'overview' && (
                        <div className="space-y-6">
                            <section className="bg-white dark:bg-stone-900 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-900">
                                <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                                <h2 className="text-2xl font-bold text-academic-primary dark:text-white mb-3">Welcome to the Research Lab</h2>
                                <p className="text-academic-secondary dark:text-stone-300 leading-relaxed mb-4">
                                    Your comprehensive toolkit for conducting rigorous political science research. From designing studies to analyzing data, from citing sources to ensuring ethical compliance, everything you need is here.
                                </p>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white dark:bg-stone-900 p-4 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600">50+</p>
                                        <p className="text-xs text-academic-secondary">Research Methods</p>
                                    </div>
                                    <div className="bg-white dark:bg-stone-900 p-4 rounded-lg">
                                        <p className="text-3xl font-bold text-purple-600">20+</p>
                                        <p className="text-xs text-academic-secondary">Analysis Tools</p>
                                    </div>
                                    <div className="bg-white dark:bg-stone-900 p-4 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600">1000+</p>
                                        <p className="text-xs text-academic-secondary">Data Sources</p>
                                    </div>
                                </div>
                            </section>

                            {/* Quick Tools */}
                            <section>
                                <h3 className="text-xl font-bold text-academic-primary dark:text-white mb-4">Quick Access Tools</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {RESEARCH_TOOLS.map((tool, i) => {
                                        const Icon = tool.icon;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setActiveSection('tools')}
                                                className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-academic-accent dark:hover:border-indigo-500 transition group text-left"
                                            >
                                                <Icon className="w-8 h-8 text-academic-accent mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="font-semibold text-sm text-academic-primary dark:text-white mb-1">{tool.name}</p>
                                                <p className="text-xs text-academic-secondary line-clamp-2">{tool.desc}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* METHODOLOGIES */}
                    {activeSection === 'methods' && (
                        <div className="space-y-6">
                            {RESEARCH_METHODOLOGIES.map((methodology, i) => {
                                const Icon = methodology.icon;
                                const colorClasses = {
                                    blue: 'from-blue-500 to-blue-600',
                                    green: 'from-green-500 to-green-600',
                                    purple: 'from-purple-500 to-purple-600',
                                    orange: 'from-orange-500 to-orange-600'
                                };
                                return (
                                    <section key={i} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                                        <div className={`bg-gradient-to-r ${colorClasses[methodology.color as keyof typeof colorClasses]} p-6 text-white`}>
                                            <div className="flex items-center gap-4">
                                                <Icon className="w-10 h-10" />
                                                <div>
                                                    <h3 className="text-2xl font-bold">{methodology.name}</h3>
                                                    <p className="text-white/90 mt-1">{methodology.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="font-bold text-sm uppercase tracking-wider text-academic-secondary mb-3">Key Methods</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {methodology.methods.map((method, j) => (
                                                    <button
                                                        key={j}
                                                        onClick={() => onNavigate('Generic', method)}
                                                        className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg hover:bg-academic-accent/10 dark:hover:bg-academic-accent/20 transition text-left group"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-academic-primary dark:text-white">{method}</span>
                                                            <ChevronRight className="w-4 h-4 text-academic-secondary group-hover:text-academic-accent transition" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}

                    {/* TOOLS */}
                    {activeSection === 'tools' && (
                        <div className="space-y-6">
                            {/* Citation Generator */}
                            <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText className="w-6 h-6 text-academic-accent" />
                                    <h3 className="text-xl font-bold text-academic-primary dark:text-white">Citation Generator</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-academic-secondary mb-2">Citation Style</label>
                                        <select 
                                            value={selectedStyle}
                                            onChange={(e) => setSelectedStyle(e.target.value)}
                                            className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-academic-accent focus:border-transparent outline-none"
                                        >
                                            {CITATION_STYLES.map(style => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-academic-secondary mb-2">Source Information</label>
                                        <textarea
                                            value={citationText}
                                            onChange={(e) => setCitationText(e.target.value)}
                                            placeholder="Enter author, title, year, publication..."
                                            className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-academic-accent focus:border-transparent outline-none resize-none"
                                            rows={4}
                                        />
                                    </div>
                                    
                                    <button className="w-full px-6 py-3 bg-academic-accent text-white rounded-lg font-semibold hover:bg-academic-accent/90 transition flex items-center justify-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Generate Citation
                                    </button>
                                </div>
                            </section>

                            {/* All Tools Grid */}
                            <section>
                                <h3 className="text-xl font-bold text-academic-primary dark:text-white mb-4">All Research Tools</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {RESEARCH_TOOLS.map((tool, i) => {
                                        const Icon = tool.icon;
                                        return (
                                            <div key={i} className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-academic-accent transition">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-academic-accent/10 rounded-lg">
                                                        <Icon className="w-6 h-6 text-academic-accent" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-academic-primary dark:text-white mb-1">{tool.name}</h4>
                                                        <p className="text-sm text-academic-secondary mb-3">{tool.desc}</p>
                                                        <button className="text-xs font-semibold text-academic-accent hover:underline">
                                                            Open Tool →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* ETHICS */}
                    {activeSection === 'ethics' && (
                        <div className="space-y-6">
                            <section className="bg-white dark:bg-stone-900 dark:from-red-950/20 dark:to-orange-950/20 p-8 rounded-2xl border border-red-200 dark:border-red-900">
                                <Users className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
                                <h2 className="text-2xl font-bold text-academic-primary dark:text-white mb-3">Research Ethics</h2>
                                <p className="text-academic-secondary dark:text-stone-300 leading-relaxed">
                                    Ethical research is fundamental to political science. Protecting participants, maintaining integrity, and ensuring responsible scholarship are non-negotiable principles.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-academic-primary dark:text-white mb-4">Core Ethical Principles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {RESEARCH_ETHICS.map((principle, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onNavigate('Generic', `Research Ethics: ${principle}`)}
                                            className="p-5 bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-200 dark:border-stone-800 hover:border-red-500 dark:hover:border-red-600 transition text-left group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-academic-primary dark:text-white group-hover:text-red-600 transition">
                                                    {principle}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-academic-secondary group-hover:text-red-600 transition" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
