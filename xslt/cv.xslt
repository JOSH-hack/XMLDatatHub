<?xml version="1.0" encoding="UTF-8"?>
<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform">
    <xslt:template match="/">
        <div class="cv-container neon-border p-4">
            <header class="mb-4">
                <h1 class="text-neon-cyan"><xslt:value-of select="cv/personal-info/name"/></h1>
                <h2 class="text-neon-purple"><xslt:value-of select="cv/personal-info/title"/></h2>
                <p>Email: <xslt:value-of select="cv/personal-info/email"/></p>
                <p>Phone: <xslt:value-of select="cv/personal-info/phone"/></p>
            </header>
            
            <section class="experience mb-4">
                <h3 class="border-bottom border-neon-blue pb-2">Expérience</h3>
                <xslt:for-each select="cv/experience/job">
                    <div class="job mt-3">
                        <h4 class="text-neon-blue"><xslt:value-of select="position"/> @ <xslt:value-of select="company"/></h4>
                        <p class="text-muted"><xslt:value-of select="period"/></p>
                        <p><xslt:value-of select="description"/></p>
                    </div>
                </xslt:for-each>
            </section>
            
            <section class="skills">
                <h3 class="border-bottom border-neon-blue pb-2">Compétences</h3>
                <div class="d-flex flex-wrap gap-2 mt-2">
                    <xslt:for-each select="cv/skills/skill">
                        <span class="badge bg-dark border border-neon-cyan text-neon-cyan"><xslt:value-of select="."/></span>
                    </xslt:for-each>
                </div>
            </section>
        </div>
    </xslt:template>
</xslt:stylesheet>
