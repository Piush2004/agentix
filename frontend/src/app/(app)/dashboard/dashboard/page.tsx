import React from 'react';

export default function Screen_9f214866d93441ec83386ad2b080acc9() {
  return (
    <>

<div className="max-w-max-width mx-auto space-y-xl">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-background mb-1">Dashboard Overview</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Monitor active AI models and research datasets across your workspace.</p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 border border-outline-variant text-primary rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">upload</span>
                            Upload Data
                        </button>
<button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-[18px]">add</span>
                            Create Model
                        </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="col-span-1 md:col-span-3 bg-surface-container-lowest rounded-xl card-border p-lg flex flex-col justify-between">
<div className="flex items-start justify-between mb-4">
<span className="font-title-md text-title-md text-on-surface-variant">Active Projects</span>
<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">folder_open</span>
</div>
</div>
<div>
<div className="font-display-lg text-display-lg text-on-surface">12</div>
<div className="flex items-center gap-1 text-tertiary-container mt-1">
<span className="material-symbols-outlined text-[14px]">arrow_upward</span>
<span className="font-label-md text-label-md">+2 this week</span>
</div>
</div>
</div>
<div className="col-span-1 md:col-span-3 bg-surface-container-lowest rounded-xl card-border p-lg flex flex-col justify-between">
<div className="flex items-start justify-between mb-4">
<span className="font-title-md text-title-md text-on-surface-variant">Total Datasets</span>
<div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-[18px]">dataset</span>
</div>
</div>
<div>
<div className="font-display-lg text-display-lg text-on-surface">48</div>
<div className="flex items-center gap-1 text-on-surface-variant mt-1">
<span className="font-label-md text-label-md">1.2 TB total volume</span>
</div>
</div>
</div>
<div className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-xl card-border p-lg">
<div className="flex items-center justify-between mb-6">
<span className="font-title-md text-title-md text-on-surface-variant">Compute Usage</span>
<span className="font-label-md text-label-md text-primary bg-primary/10 px-2 py-1 rounded-full">Healthy</span>
</div>
<div className="flex items-end gap-2 h-20 w-full">

<div className="w-full bg-surface-container-highest rounded-t-sm h-[30%]"></div>
<div className="w-full bg-surface-container-highest rounded-t-sm h-[45%]"></div>
<div className="w-full bg-surface-container-highest rounded-t-sm h-[25%]"></div>
<div className="w-full bg-surface-container-highest rounded-t-sm h-[60%]"></div>
<div className="w-full bg-surface-container-highest rounded-t-sm h-[50%]"></div>
<div className="w-full bg-surface-container-highest rounded-t-sm h-[80%]"></div>
<div className="w-full bg-primary rounded-t-sm h-[95%]"></div>
<div className="w-full bg-primary/40 rounded-t-sm h-[70%]"></div>
<div className="w-full bg-primary/20 rounded-t-sm h-[40%]"></div>
</div>
</div>
</div>
</div>

    </>
  );
}
