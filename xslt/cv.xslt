<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>CV - <xsl:value-of select="cv/informations-personnels/nom"/></title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .cv { background: #080b14; border: 1px solid #1e3a5f; border-radius: 16px;
                padding: 2.5rem; width: 100%; color: #e2f8ff; }

          /* Header */
          .header { display: flex; align-items: center; gap: 1.5rem;
                    padding-bottom: 1.5rem; border-bottom: 1px solid #1e3a5f;
                    margin-bottom: 2rem; }
          .avatar { width: 64px; height: 64px; border-radius: 50%;
                    background: #0e1e35; border: 2px solid #22d3ee;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.3rem; font-weight: 700; color: #22d3ee; flex-shrink: 0; }
          .header-info h1 { font-size: 1.5rem; font-weight: 700;
                            color: #e2f8ff; margin-bottom: 4px; }
          .header-info h2 { font-size: 0.95rem; color: #a78bfa; margin-bottom: 12px; }
          .contacts { display: flex; flex-wrap: wrap; gap: 8px 20px; }
          .contact-item { font-size: 0.78rem; color: #94a3b8;
                          display: flex; align-items: center; gap: 5px; }
          .dot { width: 5px; height: 5px; border-radius: 50%;
                 background: #22d3ee; flex-shrink: 0; }

          /* Sections */
          .section { margin-bottom: 2rem; }
          .section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: .12em;
                           color: #22d3ee; text-transform: uppercase; margin-bottom: 1rem;
                           display: flex; align-items: center; gap: 8px; }
          .section-title::after { content: ''; flex: 1; height: 1px; background: #1e3a5f; }

          /* Jobs */
          .job { display: grid; grid-template-columns: 120px 1fr; gap: 0 1.25rem;
                 margin-bottom: 1.25rem; padding-bottom: 1.25rem;
                 border-bottom: 1px solid #0f1f35; }
          .job:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .job-meta { text-align: right; padding-top: 2px; }
          .job-period { font-size: 0.72rem; color: #22d3ee; background: #0e1e35;
                        border: 1px solid #1e3a5f; border-radius: 6px;
                        padding: 3px 8px; display: inline-block; white-space: nowrap; }
          .job-company { font-size: 0.75rem; color: #64748b; margin-top: 6px; }
          .job-position { font-size: 0.95rem; font-weight: 600;
                          color: #e2f8ff; margin-bottom: 6px; }
          .job-desc { font-size: 0.82rem; color: #94a3b8; line-height: 1.65; }
          .tag-current { font-size: 0.6rem; background: #14532d; color: #4ade80;
                         border-radius: 4px; padding: 1px 5px; margin-left: 6px; }

          /* Skills */
          .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill { background: #0e1e35; border: 1px solid #1e4060; border-radius: 8px;
                   padding: 6px 14px; font-size: 0.78rem; color: #67e8f9; }
        </style>
      </head>
      <body>
        <div class="cv">

          <!-- Header -->
          <div class="header">
            <div class="avatar">
              <!-- Initiales : 2 premières lettres du nom -->
              <xsl:value-of select="substring(cv/informations-personnels/nom, 1, 2)"/>
            </div>
            <div class="header-info">
              <h1><xsl:value-of select="cv/informations-personnels/nom"/></h1>
              <h2><xsl:value-of select="cv/informations-personnels/titre"/></h2>
              <div class="contacts">
                <span class="contact-item">
                  <span class="dot"></span>
                  <xsl:value-of select="cv/informations-personnels/email"/>
                </span>
                <span class="contact-item">
                  <span class="dot"></span>
                  <xsl:value-of select="cv/informations-personnels/tel"/>
                </span>
                <span class="contact-item">
                  <span class="dot"></span>
                  <xsl:value-of select="cv/informations-personnels/adresse"/>
                </span>
              </div>
            </div>
          </div>

          <!-- Expérience -->
          <div class="section">
            <div class="section-title">Expérience professionnelle</div>
            <xsl:for-each select="cv/experience/job">
              <div class="job">
                <div class="job-meta">
                  <span class="job-period"><xsl:value-of select="periode"/></span>
                  <div class="job-company"><xsl:value-of select="compagnie"/></div>
                </div>
                <div class="job-content">
                  <div class="job-position">
                    <xsl:value-of select="position"/>
                    <xsl:if test="contains(periode, 'Maintenant')">
                      <span class="tag-current">Actuel</span>
                    </xsl:if>
                  </div>
                  <div class="job-desc"><xsl:value-of select="description"/></div>
                </div>
              </div>
            </xsl:for-each>
          </div>

          <!-- Compétences -->
          <div class="section">
            <div class="section-title">Compétences</div>
            <div class="skills-grid">
              <xsl:for-each select="cv/skills/skill">
                <span class="skill"><xsl:value-of select="."/></span>
              </xsl:for-each>
            </div>
          </div>

        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
