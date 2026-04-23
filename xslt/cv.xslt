<?xml version="1.0" encoding="UTF-8"?>
<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform">
    <xslt:template match="/">
        <div class="mx-auto text-white font-sans min-h-screen bg-[#0c0c0c] selection:bg-cyan-500/30 overflow-x-hidden relative" style="width: 100%;">
            
            <div class="relative z-10 max-w-4xl mx-auto p-6 md:p-16 space-y-16 animate-in fade-in duration-1000">
                
                <!-- Identité Header -->
                <header class="space-y-6">
                    <div class="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div class="space-y-2">
                             <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-cyan-400 uppercase"><xslt:value-of select="cv/informations-personnels/nom"/></h1>
                             <p class="text-2xl font-light text-white/70 tracking-tight"><xslt:value-of select="cv/informations-personnels/titre"/></p>
                        </div>
                        <!-- Avatar Optionnel (Facultatif dans le nouveau format) -->
                        <xslt:if test="cv/informations-personnels/avatar">
                            <div class="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                <img src="{cv/informations-personnels/avatar}" class="w-full h-full object-cover" alt="Avatar"/>
                            </div>
                        </xslt:if>
                    </div>
                    
                    <!-- Contact Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm font-medium uppercase tracking-wider text-white/50">
                        <div class="flex gap-2">
                            <span>EMAIL:</span>
                            <span class="text-white"><xslt:value-of select="cv/informations-personnels/email"/></span>
                        </div>
                        <div class="flex gap-2">
                            <span>TEL:</span>
                            <span class="text-white"><xslt:value-of select="cv/informations-personnels/tel"/></span>
                        </div>
                        <div class="flex gap-2 md:col-span-2">
                            <span>ADRESSE:</span>
                            <span class="text-white"><xslt:value-of select="cv/informations-personnels/adresse"/></span>
                        </div>
                    </div>

                    <xslt:if test="cv/informations-personnels/bio">
                        <p class="text-base text-white/80 leading-relaxed max-w-3xl font-normal pt-4">
                            <xslt:value-of select="cv/informations-personnels/bio"/>
                        </p>
                    </xslt:if>
                </header>

                <div class="space-y-12">
                    <!-- Section Expérience -->
                    <section class="space-y-8">
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                            <h2 class="text-lg font-bold text-white uppercase tracking-[0.2em]">EXPÉRIENCE</h2>
                        </div>

                        <div class="grid gap-6">
                            <xslt:for-each select="cv/experience/job">
                                <div class="p-8 bg-[#4a373d]/70 rounded-3xl border border-white/5 hover:bg-[#5c4048]/90 transition-all duration-500">
                                    <div class="flex flex-col md:flex-row justify-between items-start gap-2 mb-4">
                                        <h3 class="text-2xl font-bold text-white"><xslt:value-of select="compagnie"/> @ <xslt:value-of select="position"/></h3>
                                        <div class="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                                            <xslt:value-of select="periode"/>
                                        </div>
                                    </div>
                                    <p class="text-base text-white/90 leading-relaxed font-normal">
                                        <xslt:value-of select="description"/>
                                    </p>
                                </div>
                            </xslt:for-each>
                        </div>
                    </section>

                    <!-- Section Compétences -->
                    <section class="space-y-8">
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                            <h2 class="text-lg font-bold text-white uppercase tracking-[0.2em]">COMPÉTENCES</h2>
                        </div>
                        
                        <div class="flex flex-wrap gap-4">
                            <xslt:for-each select="cv/skills/skill">
                                <div class="px-6 py-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 hover:bg-cyan-400/10 transition-colors">
                                    <span class="text-xs font-bold text-white tracking-wider uppercase"><xslt:value-of select="."/></span>
                                    <xslt:if test="@rating">
                                        <span class="ml-3 text-[10px] font-black text-cyan-400/60"><xslt:value-of select="@rating"/></span>
                                    </xslt:if>
                                </div>
                            </xslt:for-each>
                        </div>
                    </section>
                </div>

                <!-- Footer -->
                <footer class="pt-16 pb-20 border-t border-white/5 opacity-40">
                    <p class="text-[10px] font-black tracking-[0.5em] uppercase text-white/50">Généré via DataHub Proto-X • 2026</p>
                </footer>
            </div>
        </div>
    </xslt:template>
</xslt:stylesheet>
