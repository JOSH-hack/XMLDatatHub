<?xml version="1.0" encoding="UTF-8"?>
<xslt:stylesheet version="1.0" xmlns:xslt="http://www.w3.org/1999/XSL/Transform">
    <xslt:template match="/">
        <div class="product-grid">
            <xslt:for-each select="catalog/product">
                <div class="product-card neon-card">
                    <h3><xslt:value-of select="name"/></h3>
                    <p class="category"><xslt:value-of select="category"/></p>
                    <p class="desc"><xslt:value-of select="description"/></p>
                    <div class="price-stock">
                        <span class="price"><xslt:value-of select="price"/> <xslt:value-of select="price/@currency"/></span>
                        <span class="stock">Stock: <xslt:value-of select="stock"/></span>
                    </div>
                </div>
            </xslt:for-each>
        </div>
    </xslt:template>
</xslt:stylesheet>
