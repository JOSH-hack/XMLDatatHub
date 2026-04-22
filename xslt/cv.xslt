<?xml version="1.0" encoding="UTF-8"?>
<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform">
    <xslt:template match="/">
        <div class="cv-container neon-border p-8 space-y-8 max-w-4xl">
            <header class="mb-6 border-b border-cyan-500 pb-6">
                <h1 class="text-3xl font-bold text-cyan-400 mb-2">
                    <xslt:value-of select="cv/informations-personnels/nom" />
                </h1>
                <h2 class="text-xl text-purple-400 mb-4">
                    <xslt:value-of select="cv/informations-personnels/titre" />
                </h2>
                <div class="text-gray-300 text-sm space-y-1">
                    <p> Email: <xslt:value-of select="cv/informations-personnels/email" /></p>
                    <p>📱 Téléphone: <xslt:value-of select="cv/informations-personnels/tel" /></p>
                    <p>📍 Adresse: <xslt:value-of select="cv/informations-personnels/adresse" /></p>
                </div>
            </header>

            <section class="experience mb-6">
                <h3 class="text-2xl font-bold text-cyan-400 border-b border-cyan-500 pb-2 mb-4">Expérience
                    Professionnelle</h3>
                <xslt:for-each select="cv/experience/job">
                    <div class="job mb-6 bg-black/30 border border-gray-700 p-4 rounded">
                        <h4 class="text-lg text-purple-400 font-bold">
                            <xslt:value-of select="position" />
                            <span class="text-gray-400 mx-2">@</span>
                            <xslt:value-of select="compagnie" />
                        </h4>
                        <p class="text-cyan-300 text-sm mt-1">⏱️ <xslt:value-of select="periode" /></p>
                        <p class="text-gray-300 mt-3">
                            <xslt:value-of select="description" />
                        </p>
                    </div>
                </xslt:for-each>
            </section>

            <section class="skills">
                <h3 class="text-2xl font-bold text-cyan-400 border-b border-cyan-500 pb-2 mb-4">
                    Compétences</h3>
                <div class="flex flex-wrap gap-3 mt-4">
                    <xslt:for-each select="cv/skills/skill">
                        <span
                            class="inline-block px-3 py-1 bg-cyan-900/30 border border-cyan-500 text-cyan-300 rounded-full text-sm">
                            <xslt:value-of select="." />
                        </span>
                    </xslt:for-each>
                </div>
            </section>
        </div>
    </xslt:template>
</xslt:stylesheet>