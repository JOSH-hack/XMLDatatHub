<?xml version="1.0" encoding="UTF-8"?>
<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform">
    <xslt:template match="/">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <xslt:for-each select="catalogue/produit">
                <div class="bg-black/60 border border-white/5 p-6 rounded-xl hover:border-cyan-500/50 transition-all group overflow-hidden relative">
                    <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <span class="text-[40px] font-black font-mono"><xslt:value-of select="@id"/></span>
                    </div>
                    <div class="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-cyan-500/10 transition-all"></div>
                    
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-[9px] bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/20 font-mono tracking-tighter">UID: <xslt:value-of select="@id"/></span>
                        <xslt:if test="db-info/entry-created">
                            <span class="text-[9px] text-gray-700 font-mono italic">Indexed: <xslt:value-of select="db-info/entry-created"/></span>
                        </xslt:if>
                    </div>

                    <h3 class="text-white font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors"><xslt:value-of select="nom"/></h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                        <div class="w-1 h-1 bg-cyan-500 rounded-full"></div> <xslt:value-of select="categorie"/>
                    </p>
                    <p class="text-sm text-gray-400 leading-relaxed mb-6 h-12 line-clamp-2"><xslt:value-of select="description"/></p>
                    <div class="flex justify-between items-end border-t border-white/5 pt-4">
                        <div class="flex flex-col">
                            <span class="text-[10px] text-gray-600 uppercase tracking-widest leading-none mb-1">Prix</span>
                            <span class="text-xl font-bold text-white code-font"><xslt:value-of select="prix"/> <xslt:value-of select="prix/@currency"/></span>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-[10px] text-gray-600 uppercase tracking-widest leading-none mb-1">Unités</span>
                            <span class="text-xs font-bold text-cyan-400 code-font"><xslt:value-of select="stock"/> en stock</span>
                        </div>
                    </div>
                </div>
            </xslt:for-each>
        </div>
    </xslt:template>
</xslt:stylesheet>
