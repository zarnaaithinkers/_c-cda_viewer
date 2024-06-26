/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable brace-style */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable no-var */

var cdaxml = "";
var cdaxsl = "";
var hidden = new Array();
var firstsection = new Array();
var sectionorder = [];
var collapseall;
//localStorage.setItem("hidden", hidden);
var REACT_APP_HOST_URL = "https://dev.eyecare360plus.eyecare-partners.com/ecp-int-apps";
REACT_APP_HOST_URL = REACT_APP_HOST_URL.includes("REACT_APP_HOST_URL")
    ? "http://localhost:3000/"
    : REACT_APP_HOST_URL;
var url = new URL(REACT_APP_HOST_URL);
var origin = url.origin;

cdaxsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:n1="urn:hl7-org:v3"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:sdtc="urn:hl7-org:sdtc"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl">
	<xsl:output method="html" indent="yes" version="4.01" encoding="ISO-8859-1" doctype-system="http://www.w3.org/TR/html4/strict.dtd" doctype-public="-//W3C//DTD HTML 4.01//EN"/>
	<xsl:variable name="title">
		<xsl:choose>
			<xsl:when test="string-length(/n1:ClinicalDocument/n1:title)  &gt;= 1">
				<xsl:value-of select="/n1:ClinicalDocument/n1:title"/>
			</xsl:when>
			<xsl:when test="/n1:ClinicalDocument/n1:code/@displayName">
				<xsl:value-of select="/n1:ClinicalDocument/n1:code/@displayName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>Clinical Document</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:template match="/">
		<xsl:apply-templates select="n1:ClinicalDocument"/>
	</xsl:template>
	<xsl:template match="n1:ClinicalDocument">
		<div style="padding:0.25em">
			<p class="h1 h1center">
				<xsl:value-of select="$title"/>
			</p>
			<div id="{generate-id(@title)}" class="section recordTarget">
				<xsl:call-template name="recordTargetDisp"/>
			</div>
			<p style="font-size:75%">
			You can arrange the document to your preferences. Move sections by dragging them. Hide by closing. Use the TOC to review.
			</p>
		</div>
		<div id="cdabody">
			<xsl:if test="not(//n1:nonXMLBody)">
				<xsl:if test="count(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[n1:section]) &gt; 1">
					<xsl:call-template name="make-tableofcontents"/>
				</xsl:if>
			</xsl:if>
			<div id="cdabody_inner">
				<xsl:apply-templates select="n1:component/n1:structuredBody|n1:component/n1:nonXMLBody"/>
			</div>
		</div>
	</xsl:template>
	<xsl:template name="make-tableofcontents">
		<div id="tocdiv" class="stamp">
			<p id="tochead" class="h2" style="cursor:pointer;background:white;color:#1f8dd6;text-align:center;padding:0.25em">
				Table of Contents
				
				<i class="fa fa-bars fa-lg" style="margin-left:0.5em"></i>
			</p>
			<ul class="tocul" id="toc" style="display:none">
				<xsl:for-each select="n1:component/n1:structuredBody/n1:component/n1:section/n1:title">
					<li data-code="{../n1:code/@code}" class="toc">
						<span class="pure-button" style="width:15em;text-align:left">
							<i class="fa fa-check-square-o fa-fw fa-lg tocli"></i>
							<span>
								<xsl:value-of select="."/>
							</span>
						</span>
						<span class="pure-button tocup">
							<i class="fa fa-angle-double-up fa-fw fa-lg"></i>
						</span>
						<span class="pure-button tocdown">
							<i class="fa fa-angle-down fa-fw fa-lg"></i>
						</span>
					</li>
				</xsl:for-each>
				<li id="restore" class="toc pure-button" style="width: 100%;display: block;">
					<i class="fa fa-refresh fa-fw fa-lg"></i>
					<span>
							Restore original order
						</span>
				</li>
				<li id="showall" class="toc pure-button" style="width: 100%;display: block;">
					<i class="fa fa-sun-o fa-fw fa-lg"></i>
					<span>
							Show all
						</span>
				</li>
			</ul>
			<p syle="float:left" style="cursor:pointer">
				<li id="collapseall" class="toc pure-button hideshow" style="width: 100%;display: block;">
					<i class="fa fa-compress fa-fw fa-lg"></i>
					<span>
						Collapse/Expand all
					</span>
				</li>
			</p>
		</div>
	</xsl:template>
	<xsl:template name="documentGeneral">
		<table class="header_table">
			<tbody>
				<tr class="hide" style="display:none">
					<td bgcolor="#3399ff">
						<span class="td_label">
							<xsl:text>Document Id</xsl:text>
						</span>
					</td>
					<td>
						<xsl:call-template name="show-id">
							<xsl:with-param name="id" select="n1:id"/>
						</xsl:call-template>
					</td>
				</tr>
				<tr class="hide" style="display:none">
					<td bgcolor="#3399ff">
						<span class="td_label">
							<xsl:text>Document Created:</xsl:text>
						</span>
					</td>
					<td>
						<xsl:call-template name="show-time">
							<xsl:with-param name="datetime" select="n1:effectiveTime"/>
						</xsl:call-template>
					</td>
				</tr>
			</tbody>
		</table>
	</xsl:template>
	<xsl:template name="confidentiality">
		<table class="header_table">
			<tbody>
				<td bgcolor="#3399ff">
					<xsl:text>Confidentiality</xsl:text>
				</td>
				<td>
					<xsl:choose>
						<xsl:when test="n1:confidentialityCode/@code  = &apos;N&apos;">
							<xsl:text>Normal</xsl:text>
						</xsl:when>
						<xsl:when test="n1:confidentialityCode/@code  = &apos;R&apos;">
							<xsl:text>Restricted</xsl:text>
						</xsl:when>
						<xsl:when test="n1:confidentialityCode/@code  = &apos;V&apos;">
							<xsl:text>Very restricted</xsl:text>
						</xsl:when>
					</xsl:choose>
					<xsl:if test="n1:confidentialityCode/n1:originalText">
						<xsl:text></xsl:text>
						<xsl:value-of select="n1:confidentialityCode/n1:originalText"/>
					</xsl:if>
				</td>
			</tbody>
		</table>
	</xsl:template>
	<xsl:template name="author">
		<xsl:if test="n1:author">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:author/n1:assignedAuthor">
						<tr class="hide" style="display:none">
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Author</xsl:text>
								</span>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="n1:assignedPerson/n1:name">
										<xsl:call-template name="show-name">
											<xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
										</xsl:call-template>
										<xsl:if test="n1:representedOrganization">
											<xsl:text>, </xsl:text>
											<xsl:call-template name="show-name">
												<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:when>
									<xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
										<xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
									</xsl:when>
									<xsl:when test="n1:representedOrganization">
										<xsl:call-template name="show-name">
											<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:for-each select="n1:id">
											<xsl:call-template name="show-id"/>
											<br/>
										</xsl:for-each>
									</xsl:otherwise>
								</xsl:choose>
							</td>
						</tr>
						<xsl:if test="n1:addr | n1:telecom">
							<xsl:call-template name="show-contactInfo">
								<xsl:with-param name="contact" select="."/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="authenticator">
		<xsl:if test="n1:authenticator">
			<table class="header_table">
				<tbody>
						<xsl:for-each select="n1:authenticator">
							<tr>
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Signed </xsl:text>
									</span>
								</td>
								<td>
									<xsl:call-template name="show-name">
										<xsl:with-param name="name" select="n1:assignedEntity/n1:assignedPerson/n1:name"/>
									</xsl:call-template>
									<xsl:text> at </xsl:text>
									<xsl:call-template name="show-time">
										<xsl:with-param name="date" select="n1:time"/>
									</xsl:call-template>
								</td>
							</tr>
							<xsl:if test="n1:assignedEntity/n1:addr | n1:assignedEntity/n1:telecom">
								<xsl:call-template name="show-contactInfo">
									<xsl:with-param name="contact" select="n1:assignedEntity"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="legalAuthenticator">
		<xsl:if test="n1:legalAuthenticator">
			<table class="header_table">
				<tbody>
					<tr class="hide" style="display:none">
						<td bgcolor="#3399ff">
							<span class="td_label">
								<xsl:text>Legal authenticator</xsl:text>
							</span>
						</td>
						<td>
							<xsl:call-template name="show-assignedEntity">
								<xsl:with-param name="asgnEntity" select="n1:legalAuthenticator/n1:assignedEntity"/>
							</xsl:call-template>
							<xsl:text></xsl:text>
							<xsl:call-template name="show-sig">
								<xsl:with-param name="sig" select="n1:legalAuthenticator/n1:signatureCode"/>
							</xsl:call-template>
							<xsl:if test="n1:legalAuthenticator/n1:time/@value">
								<xsl:text> at </xsl:text>
								<xsl:call-template name="show-time">
									<xsl:with-param name="datetime" select="n1:legalAuthenticator/n1:time"/>
								</xsl:call-template>
							</xsl:if>
						</td>
					</tr>
					<xsl:if test="n1:legalAuthenticator/n1:assignedEntity/n1:addr | n1:legalAuthenticator/n1:assignedEntity/n1:telecom">
						<xsl:call-template name="show-contactInfo">
							<xsl:with-param name="contact" select="n1:legalAuthenticator/n1:assignedEntity"/>
						</xsl:call-template>
					</xsl:if>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="dataEnterer">
		<xsl:if test="n1:dataEnterer">
			<table class="header_table">
				<tbody>
					<tr class="hide" style="display:none">
						<td bgcolor="#3399ff">
							<span class="td_label">
								<xsl:text>Entered by</xsl:text>
							</span>
						</td>
						<td>
							<xsl:call-template name="show-assignedEntity">
								<xsl:with-param name="asgnEntity" select="n1:dataEnterer/n1:assignedEntity"/>
							</xsl:call-template>
						</td>
					</tr>
					<xsl:if test="n1:dataEnterer/n1:assignedEntity/n1:addr | n1:dataEnterer/n1:assignedEntity/n1:telecom">
						<xsl:call-template name="show-contactInfo">
							<xsl:with-param name="contact" select="n1:dataEnterer/n1:assignedEntity"/>
						</xsl:call-template>
					</xsl:if>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="componentof">
		<xsl:if test="n1:componentOf">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:componentOf/n1:encompassingEncounter">
						<xsl:if test="n1:id">
							<tr class="hide" style="display:none">
								<xsl:choose>
									<xsl:when test="n1:code">
										<td bgcolor="#3399ff">
											<span class="td_label">
												<xsl:text>Encounter Id</xsl:text>
											</span>
										</td>
										<td>
											<xsl:call-template name="show-id">
												<xsl:with-param name="id" select="n1:id"/>
											</xsl:call-template>
										</td>
										<td bgcolor="#3399ff">
											<span class="td_label">
												<xsl:text>Encounter Type</xsl:text>
											</span>
										</td>
										<td>
											<xsl:call-template name="show-code">
												<xsl:with-param name="code" select="n1:code"/>
											</xsl:call-template>
										</td>
									</xsl:when>
									<xsl:otherwise>
										<td bgcolor="#3399ff">
											<span class="td_label">
												<xsl:text>Encounter Id</xsl:text>
											</span>
										</td>
										<td>
											<xsl:call-template name="show-id">
												<xsl:with-param name="id" select="n1:id"/>
											</xsl:call-template>
										</td>
									</xsl:otherwise>
								</xsl:choose>
							</tr>
						</xsl:if>
						<tr class="hide" style="display:none">
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Encounter Date</xsl:text>
								</span>
							</td>
							<td colspan="3">
								<xsl:if test="n1:effectiveTime">
									<xsl:choose>
										<xsl:when test="n1:effectiveTime/@value">
											<xsl:text>&#160;at&#160;</xsl:text>
											<xsl:call-template name="show-time">
												<xsl:with-param name="datetime" select="n1:effectiveTime"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:when test="n1:effectiveTime/n1:low">
											<xsl:text>&#160;From&#160;</xsl:text>
											<xsl:call-template name="show-time">
												<xsl:with-param name="datetime" select="n1:effectiveTime/n1:low"/>
											</xsl:call-template>
											<xsl:if test="n1:effectiveTime/n1:high">
												<xsl:text> to </xsl:text>
												<xsl:call-template name="show-time">
													<xsl:with-param name="datetime" select="n1:effectiveTime/n1:high"/>
												</xsl:call-template>
											</xsl:if>
										</xsl:when>
									</xsl:choose>
								</xsl:if>
							</td>
						</tr>
						<xsl:if test="n1:location/n1:healthCareFacility">
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Encounter Location</xsl:text>
									</span>
								</td>
								<td colspan="3">
									<xsl:choose>
										<xsl:when test="n1:location/n1:healthCareFacility/n1:location/n1:name">
											<xsl:call-template name="show-name">
												<xsl:with-param name="name" select="n1:location/n1:healthCareFacility/n1:location/n1:name"/>
											</xsl:call-template>
											<xsl:for-each select="n1:location/n1:healthCareFacility/n1:serviceProviderOrganization/n1:name">
												<xsl:text> of </xsl:text>
												<xsl:call-template name="show-name">
													<xsl:with-param name="name" select="n1:location/n1:healthCareFacility/n1:serviceProviderOrganization/n1:name"/>
												</xsl:call-template>
											</xsl:for-each>
										</xsl:when>
										<xsl:when test="n1:location/n1:healthCareFacility/n1:code">
											<xsl:call-template name="show-code">
												<xsl:with-param name="code" select="n1:location/n1:healthCareFacility/n1:code"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:if test="n1:location/n1:healthCareFacility/n1:id">
												<xsl:text>id: </xsl:text>
												<xsl:for-each select="n1:location/n1:healthCareFacility/n1:id">
													<xsl:call-template name="show-id">
														<xsl:with-param name="id" select="."/>
													</xsl:call-template>
												</xsl:for-each>
											</xsl:if>
										</xsl:otherwise>
									</xsl:choose>
								</td>
							</tr>
						</xsl:if>
						<xsl:if test="n1:responsibleParty">
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Responsible party</xsl:text>
									</span>
								</td>
								<td colspan="3">
									<xsl:call-template name="show-assignedEntity">
										<xsl:with-param name="asgnEntity" select="n1:responsibleParty/n1:assignedEntity"/>
									</xsl:call-template>
								</td>
							</tr>
						</xsl:if>
						<xsl:if test="n1:responsibleParty/n1:assignedEntity/n1:addr | n1:responsibleParty/n1:assignedEntity/n1:telecom">
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Contact info</xsl:text>
									</span>
								</td>
								<td colspan="3">
									<xsl:call-template name="show-contactInfo">
										<xsl:with-param name="contact" select="n1:responsibleParty/n1:assignedEntity"/>
									</xsl:call-template>
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="custodian">
		<xsl:if test="n1:custodian">
			<table class="header_table">
				<tbody>
					<tr class="hide" style="display:none">
						<td bgcolor="#3399ff">
							<span class="td_label">
								<xsl:text>Document maintained by</xsl:text>
							</span>
						</td>
						<td>
							<xsl:choose>
								<xsl:when test="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name">
									<xsl:call-template name="show-name">
										<xsl:with-param name="name" select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:for-each select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:id">
										<xsl:call-template name="show-id"/>
										<xsl:if test="position()!=last()">
											<br/>
										</xsl:if>
									</xsl:for-each>
								</xsl:otherwise>
							</xsl:choose>
						</td>
					</tr>
					<xsl:if test="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:addr | n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:telecom">
						<xsl:call-template name="show-contactInfo">
							<xsl:with-param name="contact" select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization"/>
						</xsl:call-template>
					</xsl:if>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="documentationOf">
		<xsl:if test="n1:documentationOf">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:documentationOf">
						<xsl:if test="n1:serviceEvent/@classCode and n1:serviceEvent/n1:code">
							<xsl:variable name="displayName">
								<xsl:call-template name="show-actClassCode">
									<xsl:with-param name="clsCode" select="n1:serviceEvent/@classCode"/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:if test="$displayName">
								<tr class="hide" style="display:none">
									<td bgcolor="#3399ff">
										<span class="td_label">
											<xsl:call-template name="firstCharCaseUp">
												<xsl:with-param name="data" select="$displayName"/>
											</xsl:call-template>
										</span>
									</td>
									<td colspan="3">
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="n1:serviceEvent/n1:code"/>
										</xsl:call-template>
										<xsl:if test="n1:serviceEvent/n1:effectiveTime">
											<xsl:choose>
												<xsl:when test="n1:serviceEvent/n1:effectiveTime/@value">
													<xsl:text>&#160;at&#160;</xsl:text>
													<xsl:call-template name="show-time">
														<xsl:with-param name="datetime" select="n1:serviceEvent/n1:effectiveTime"/>
													</xsl:call-template>
												</xsl:when>
												<xsl:when test="n1:serviceEvent/n1:effectiveTime/n1:low">
													<xsl:text>&#160;from&#160;</xsl:text>
													<xsl:call-template name="show-time">
														<xsl:with-param name="datetime" select="n1:serviceEvent/n1:effectiveTime/n1:low"/>
													</xsl:call-template>
													<xsl:if test="n1:serviceEvent/n1:effectiveTime/n1:high">
														<xsl:text> to </xsl:text>
														<xsl:call-template name="show-time">
															<xsl:with-param name="datetime" select="n1:serviceEvent/n1:effectiveTime/n1:high"/>
														</xsl:call-template>
													</xsl:if>
												</xsl:when>
											</xsl:choose>
										</xsl:if>
									</td>
								</tr>
							</xsl:if>
						</xsl:if>
						<xsl:for-each select="n1:serviceEvent/n1:performer">
							<xsl:variable name="displayName">
								<xsl:call-template name="show-participationType">
									<xsl:with-param name="ptype" select="@typeCode"/>
								</xsl:call-template>
								<xsl:text></xsl:text>
								<xsl:if test="n1:functionCode/@code">
									<xsl:call-template name="show-participationFunction">
										<xsl:with-param name="pFunction" select="n1:functionCode/@code"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:variable>
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:call-template name="firstCharCaseUp">
											<xsl:with-param name="data" select="$displayName"/>
										</xsl:call-template>
									</span>
								</td>
								<td colspan="3">
									<xsl:call-template name="show-assignedEntity">
										<xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
									</xsl:call-template>
								</td>
							</tr>
						</xsl:for-each>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="inFulfillmentOf">
		<xsl:if test="n1:infulfillmentOf">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:inFulfillmentOf">
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>In fulfillment of</xsl:text>
								</span>
							</td>
							<td>
								<xsl:for-each select="n1:order">
									<xsl:for-each select="n1:id">
										<xsl:call-template name="show-id"/>
									</xsl:for-each>
									<xsl:for-each select="n1:code">
										<xsl:text>&#160;</xsl:text>
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="."/>
										</xsl:call-template>
									</xsl:for-each>
									<xsl:for-each select="n1:priorityCode">
										<xsl:text>&#160;</xsl:text>
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="."/>
										</xsl:call-template>
									</xsl:for-each>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="informant">
		<xsl:if test="n1:informant">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:informant">
						<tr class="hide" style="display:none">
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Informant</xsl:text>
								</span>
							</td>
							<td>
								<xsl:if test="n1:assignedEntity">
									<xsl:call-template name="show-assignedEntity">
										<xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
									</xsl:call-template>
								</xsl:if>
								<xsl:if test="n1:relatedEntity">
									<xsl:call-template name="show-relatedEntity">
										<xsl:with-param name="relatedEntity" select="n1:relatedEntity"/>
									</xsl:call-template>
								</xsl:if>
							</td>
						</tr>
						<xsl:choose>
							<xsl:when test="n1:assignedEntity/n1:addr | n1:assignedEntity/n1:telecom">
								<tr class="hide" style="display:none">
									<td bgcolor="#3399ff">
										<span class="td_label">
											<xsl:text>Contact info</xsl:text>
										</span>
									</td>
									<td>
										<xsl:if test="n1:assignedEntity">
											<xsl:call-template name="show-contactInfo">
												<xsl:with-param name="contact" select="n1:assignedEntity"/>
											</xsl:call-template>
										</xsl:if>
									</td>
								</tr>
							</xsl:when>
							<xsl:when test="n1:relatedEntity/n1:addr | n1:relatedEntity/n1:telecom">
								<tr class="hide" style="display:none">
									<td bgcolor="#3399ff">
										<span class="td_label">
											<xsl:text>Contact info</xsl:text>
										</span>
									</td>
									<td>
										<xsl:if test="n1:relatedEntity">
											<xsl:call-template name="show-contactInfo">
												<xsl:with-param name="contact" select="n1:relatedEntity"/>
											</xsl:call-template>
										</xsl:if>
									</td>
								</tr>
							</xsl:when>
						</xsl:choose>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="informationRecipient">
		<xsl:if test="n1:informationRecipient">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:informationRecipient">
						<tr class="hide" style="display:none">
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Information recipient:</xsl:text>
								</span>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="n1:intendedRecipient/n1:informationRecipient/n1:name">
										<xsl:for-each select="n1:intendedRecipient/n1:informationRecipient">
											<xsl:call-template name="show-name">
												<xsl:with-param name="name" select="n1:name"/>
											</xsl:call-template>
											<xsl:if test="position() != last()">
												<br/>
											</xsl:if>
										</xsl:for-each>
									</xsl:when>
									<xsl:otherwise>
										<xsl:for-each select="n1:intendedRecipient">
											<xsl:for-each select="n1:id">
												<xsl:call-template name="show-id"/>
											</xsl:for-each>
											<xsl:if test="position() != last()">
												<br/>
											</xsl:if>
											<br/>
										</xsl:for-each>
									</xsl:otherwise>
								</xsl:choose>
							</td>
						</tr>
						<xsl:if test="n1:intendedRecipient/n1:addr | n1:intendedRecipient/n1:telecom">
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Contact info</xsl:text>
									</span>
								</td>
								<td>
									<xsl:call-template name="show-contactInfo">
										<xsl:with-param name="contact" select="n1:intendedRecipient"/>
									</xsl:call-template>
								</td>
							</tr>
						</xsl:if>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="participant">
		<xsl:if test="n1:participant">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:participant">
						<tr class="hide" style="display:none">
							<td bgcolor="#3399ff">
								<xsl:variable name="participtRole">
									<xsl:call-template name="translateRoleAssoCode">
										<xsl:with-param name="classCode" select="n1:associatedEntity/@classCode"/>
										<xsl:with-param name="code" select="n1:associatedEntity/n1:code"/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:choose>
									<xsl:when test="$participtRole">
										<span class="td_label">
											<xsl:call-template name="firstCharCaseUp">
												<xsl:with-param name="data" select="$participtRole"/>
											</xsl:call-template>
										</span>
									</xsl:when>
									<xsl:otherwise>
										<span class="td_label">
											<xsl:text>Participant</xsl:text>
										</span>
									</xsl:otherwise>
								</xsl:choose>
							</td>
							<td>
								<xsl:if test="n1:functionCode">
									<xsl:call-template name="show-code">
										<xsl:with-param name="code" select="n1:functionCode"/>
									</xsl:call-template>
								</xsl:if>
								<xsl:call-template name="show-associatedEntity">
									<xsl:with-param name="assoEntity" select="n1:associatedEntity"/>
								</xsl:call-template>
								<xsl:if test="n1:time">
									<xsl:if test="n1:time/n1:low">
										<xsl:text> from </xsl:text>
										<xsl:call-template name="show-time">
											<xsl:with-param name="datetime" select="n1:time/n1:low"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="n1:time/n1:high">
										<xsl:text> to </xsl:text>
										<xsl:call-template name="show-time">
											<xsl:with-param name="datetime" select="n1:time/n1:high"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
								<xsl:if test="position() != last()">
									<br/>
								</xsl:if>
							</td>
						</tr>
						<xsl:if test="n1:associatedEntity/n1:addr | n1:associatedEntity/n1:telecom">
							<xsl:call-template name="show-contactInfo">
								<xsl:with-param name="contact" select="n1:associatedEntity"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="recordTarget">
		<table class="header_table">
			<tbody>
				<xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole">
					<xsl:if test="not(n1:id/@nullFlavor)">
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Patient</xsl:text>
								</span>
							</td>
							<td colspan="3">
								<xsl:call-template name="show-name">
									<xsl:with-param name="name" select="n1:patient/n1:name"/>
								</xsl:call-template>
							</td>
						</tr>
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>D.O.B</xsl:text>
								</span>
							</td>
							<td>
								<xsl:call-template name="show-time">
									<xsl:with-param name="datetime" select="n1:patient/n1:birthTime"/>
								</xsl:call-template>
							</td>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Sex</xsl:text>
								</span>
							</td>
							<td>
								<xsl:for-each select="n1:patient/n1:administrativeGenderCode">
									<xsl:call-template name="show-gender"/>
								</xsl:for-each>
							</td>
						</tr>
						<xsl:if test="n1:patient/n1:raceCode | (n1:patient/n1:ethnicGroupCode)">
							<tr>
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Race</xsl:text>
									</span>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="n1:patient/n1:raceCode">
											<xsl:for-each select="n1:patient/n1:raceCode">
												<xsl:call-template name="show-race-ethnicity"/>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>Information not available</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</td>
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Ethnicity</xsl:text>
									</span>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="n1:patient/n1:ethnicGroupCode">
											<xsl:for-each select="n1:patient/n1:ethnicGroupCode">
												<xsl:call-template name="show-race-ethnicity"/>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>Information not available</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</td>
							</tr>
						</xsl:if>
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Contact info</xsl:text>
								</span>
							</td>
							<td>
								<xsl:call-template name="show-contactInfo">
									<xsl:with-param name="contact" select="."/>
								</xsl:call-template>
							</td>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Patient IDs</xsl:text>
								</span>
							</td>
							<td>
								<xsl:for-each select="n1:id">
									<xsl:call-template name="show-id"/>
									<br/>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
				</xsl:for-each>
			</tbody>
		</table>
	  <xsl:call-template name="documentGeneral"/>
	  <xsl:call-template name="setAndVersion"/>
	  <xsl:call-template name="documentationOf"/>
	  <xsl:call-template name="author"/>
	  <xsl:call-template name="componentof"/>
	  <xsl:call-template name="participant"/>
	  <xsl:call-template name="dataEnterer"/>
	  <xsl:call-template name="authenticator"/>
	  <xsl:call-template name="informant"/>
	  <xsl:call-template name="informationRecipient"/>
	  <xsl:call-template name="legalAuthenticator"/>
	  <xsl:call-template name="custodian"/>
	</xsl:template>
	<xsl:template name="recordTargetDisp">
		<table class="header_table">
			<tbody>
				<xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole">
					<xsl:if test="not(n1:id/@nullFlavor)">
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Patient</xsl:text>
								</span>
							</td>
							<td colspan="3">
								<xsl:call-template name="show-name">
									<xsl:with-param name="name" select="n1:patient/n1:name"/>
								</xsl:call-template>
							</td>
						</tr>
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>D.O.B</xsl:text>
								</span>
							</td>
							<td>
								<xsl:call-template name="show-time">
									<xsl:with-param name="datetime" select="n1:patient/n1:birthTime"/>
								</xsl:call-template>
							</td>
						</tr>
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Sex</xsl:text>
								</span>
							</td>
							<td>
								<xsl:for-each select="n1:patient/n1:administrativeGenderCode">
									<xsl:call-template name="show-gender"/>
								</xsl:for-each>
							</td>
						</tr>
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Contact info</xsl:text>
								</span>
							</td>
							<td colspan="3">
								<xsl:for-each select="n1:addr">
									<xsl:call-template name="show-address">
										<xsl:with-param name="address" select="."/>
									</xsl:call-template>
								</xsl:for-each>
								<xsl:for-each select="n1:telecom">
									<xsl:call-template name="show-telecom">
										<xsl:with-param name="telecom" select="."/>
									</xsl:call-template>
								</xsl:for-each>
							</td>
						</tr>
						<tr>
							<td colspan="4">
								<span class="pure-button" style="padding-top:0;padding-bottom:0" onclick="$('tr.hide').fadeToggle();$('#cdabody').packery()">Patient Detail</span>
							</td>
						</tr>
						<xsl:if test="n1:patient/n1:raceCode | (n1:patient/n1:ethnicGroupCode)">
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Race</xsl:text>
									</span>
								</td>
								<td colspan="3">
									<xsl:choose>
										<xsl:when test="n1:patient/n1:raceCode">
											<xsl:for-each select="n1:patient/n1:raceCode">
												<xsl:call-template name="show-race-ethnicity"/>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>Information not available</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</td>
							</tr>
							<xsl:if test="n1:patient/sdtc:raceCode">
								<tr class="hide" style="display:none">
									<td bgcolor="#3399ff">
										<span class="td_label">
											<xsl:text>More Granular Race Code</xsl:text>
										</span>
									</td>
									<td colspan="3">
										<xsl:choose>
											<xsl:when test="n1:patient/sdtc:raceCode">
												<xsl:for-each select="n1:patient/sdtc:raceCode">
													<xsl:value-of select="@displayName"/>
												</xsl:for-each>
											</xsl:when>
											<xsl:otherwise>
												<xsl:text>Information not available</xsl:text>
											</xsl:otherwise>
										</xsl:choose>
									</td>
								</tr>
							</xsl:if>
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Ethnicity</xsl:text>
									</span>
								</td>
								<td colspan="3">
									<xsl:choose>
										<xsl:when test="n1:patient/n1:ethnicGroupCode">
											<xsl:for-each select="n1:patient/n1:ethnicGroupCode">
												<xsl:call-template name="show-race-ethnicity"/>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>Information not available</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</td>
							</tr>
						</xsl:if>
						<xsl:if test="n1:patient/n1:languageCommunication">
							<tr class="hide" style="display:none">
								<td bgcolor="#3399ff">
									<span class="td_label">
										<xsl:text>Language Communication</xsl:text>
									</span>
								</td>
								<td colspan="3">
									<xsl:choose>
										<xsl:when test="not(n1:patient/n1:languageCommunication/@nullFlavor)">
											<xsl:value-of select="n1:patient/n1:languageCommunication/n1:languageCode/@code"/>
											<xsl:text>, preferred: </xsl:text>
											<xsl:if test="n1:patient/n1:languageCommunication/n1:preferenceInd/@value = 'true'">
												<xsl:text>yes</xsl:text>
											</xsl:if>
											<xsl:if test="n1:patient/n1:languageCommunication/n1:preferenceInd/@value != 'true'">
												<xsl:text>no</xsl:text>
											</xsl:if>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text>Unknown</xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</td>
							</tr>
						</xsl:if>
						<xsl:call-template name="show-contactInfo">
							<xsl:with-param name="contact" select="."/>
						</xsl:call-template>
						<tr class="hide" style="display:none">
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Patient IDs</xsl:text>
								</span>
							</td>
							<td colspan="3">
								<xsl:for-each select="n1:id">
									<xsl:call-template name="show-id"/>
									<br/>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
				</xsl:for-each>
			</tbody>
		</table>
	  <xsl:call-template name="documentGeneral"/>
	  <xsl:call-template name="setAndVersion"/>
	  <xsl:call-template name="documentationOf"/>
	  <xsl:call-template name="author"/>
	  <xsl:call-template name="componentof"/>
	  <xsl:call-template name="participant"/>
	  <xsl:call-template name="dataEnterer"/>
	  <xsl:call-template name="authenticator"/>
	  <xsl:call-template name="informant"/>
	  <xsl:call-template name="informationRecipient"/>
	  <xsl:call-template name="legalAuthenticator"/>
	  <xsl:call-template name="custodian"/>
	</xsl:template>
	<xsl:template name="relatedDocument">
		<xsl:if test="n1:relatedDocument">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:relatedDocument">
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Related document</xsl:text>
								</span>
							</td>
							<td>
								<xsl:for-each select="n1:parentDocument">
									<xsl:for-each select="n1:id">
										<xsl:call-template name="show-id"/>
										<br/>
									</xsl:for-each>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="authorization">
		<xsl:if test="n1:authorization">
			<table class="header_table">
				<tbody>
					<xsl:for-each select="n1:authorization">
						<tr>
							<td bgcolor="#3399ff">
								<span class="td_label">
									<xsl:text>Consent</xsl:text>
								</span>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="n1:consent/n1:code">
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="n1:consent/n1:code"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="n1:consent/n1:statusCode"/>
										</xsl:call-template>
									</xsl:otherwise>
								</xsl:choose>
								<br/>
							</td>
						</tr>
					</xsl:for-each>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template name="setAndVersion">
		<xsl:if test="n1:setId and n1:versionNumber">
			<table class="header_table">
				<tbody>
					<tr class="hide" style="display:none">
						<td bgcolor="#3399ff">
								<span class="td_label">
								  <xsl:text>SetId and Version</xsl:text>
						</span>
						</td>
						<td colspan="3">
							<xsl:text>SetId: </xsl:text>
							<xsl:call-template name="show-id">
								<xsl:with-param name="id" select="n1:setId"/>
							</xsl:call-template>
							<xsl:text>  Version: </xsl:text>
							<xsl:value-of select="n1:versionNumber/@value"/>
						</td>
					</tr>
				</tbody>
			</table>
		</xsl:if>
	</xsl:template>
	<xsl:template match="n1:component/n1:structuredBody">
		<xsl:for-each select="n1:component/n1:section">
			<xsl:call-template name="section"/>
		</xsl:for-each>
	</xsl:template>
	<xsl:template match='n1:component/n1:nonXMLBody'>
		<xsl:choose>
			<xsl:when test='n1:text/n1:reference'>
				<IFRAME name='nonXMLBody' id='nonXMLBody' WIDTH='80%' HEIGHT='600' src='{n1:text/n1:reference/@value}'/>
			</xsl:when>
			<xsl:when test='n1:text/@mediaType="text/plain"'>
				<pre>
					<xsl:value-of select='n1:text/text()'/>
				</pre>
			</xsl:when>
			<xsl:otherwise>
				<CENTER>Cannot display the text</CENTER>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="section">
		<div id="{generate-id(n1:title)}" class="section" data-code="{n1:code/@code}">
			<div class="section_in">
				<xsl:call-template name="section-title">
					<xsl:with-param name="title" select="n1:title"/>
				</xsl:call-template>
				<xsl:call-template name="section-author"/>
				<xsl:call-template name="section-text"/>
				<xsl:for-each select="n1:component/n1:section">
					<xsl:call-template name="nestedSection">
						<xsl:with-param name="margin" select="2"/>
					</xsl:call-template>
				</xsl:for-each>
			</div>
		</div>
	</xsl:template>
	<xsl:template name="section-title">
		<xsl:param name="title"/>
		<xsl:param name="lctitle">
			<xsl:value-of select="translate($title,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')" />
		</xsl:param>
		<xsl:param name="len">
			<xsl:value-of select="string-length($title)" />
		</xsl:param>
		<xsl:param name="idx">
			<xsl:value-of select="$len mod 10" />
		</xsl:param>
		<xsl:variable name="awesome">
			<xsl:choose>
				<xsl:when test="substring-after($lctitle,'family')!=''">users</xsl:when>
				<xsl:when test="$lctitle='medications'">medkit</xsl:when>
				<xsl:when test="$lctitle='reason for referral'">ambulance</xsl:when>
				<xsl:when test="$lctitle='results'">clipboard</xsl:when>
				<xsl:when test="$idx=0">ambulance</xsl:when>
				<xsl:when test="$idx=1">heartbeat</xsl:when>
				<xsl:when test="$idx=2">stethoscope</xsl:when>
				<xsl:when test="$idx=3">h-square</xsl:when>
				<xsl:when test="$idx=4">hospital-o</xsl:when>
				<xsl:when test="$idx=5">user-md</xsl:when>
				<xsl:when test="$idx=6">heart</xsl:when>
				<xsl:when test="$idx=7">medkit</xsl:when>
				<xsl:when test="$idx=8">heart-o</xsl:when>
				<xsl:when test="$idx=9">plus-square</xsl:when>
				<xsl:otherwise>medkit</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="count(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[n1:section]) &gt; 1">
				<div class="controls">
					<i class="fa fa-expand btn minimise pure-button"></i>
					<i class="fa fa-angle-double-up btn sectionup pure-button"></i>
					<i class="fa fa-angle-down btn sectiondown pure-button"></i>
					<i class="fa fa-close btn delete pure-button"></i>
				</div>
				<i class="fa fa-{$awesome} thumb"></i>
				<p class="secth3">
					<xsl:call-template name="firstCharCaseUp">
						<xsl:with-param name="data" select="$lctitle"/>
					</xsl:call-template>
				</p>
			</xsl:when>
			<xsl:otherwise>
				<p class="h3">
					<xsl:value-of select="$title"/>
				</p>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="section-author">
		<xsl:if test="count(n1:author)&gt;0">
			<div style="margin-left : 2em;">
				<b>
					<xsl:text>Section Author: </xsl:text>
				</b>
				<xsl:for-each select="n1:author/n1:assignedAuthor">
					<xsl:choose>
						<xsl:when test="n1:assignedPerson/n1:name">
							<xsl:call-template name="show-name">
								<xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
							</xsl:call-template>
							<xsl:if test="n1:representedOrganization">
								<xsl:text>, </xsl:text>
								<xsl:call-template name="show-name">
									<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:when>
						<xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
							<xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:for-each select="n1:id">
								<xsl:call-template name="show-id"/>
								<br/>
							</xsl:for-each>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
				<br/>
			</div>
		</xsl:if>
	</xsl:template>
	<xsl:template name="section-text">
		<div class="sectiontext">
			<xsl:apply-templates select="n1:text"/>
		</div>
	</xsl:template>
	<xsl:template name="nestedSection">
		<xsl:param name="margin"/>
		<h4 style="margin-left : {$margin}em;">
			<xsl:value-of select="n1:title"/>
		</h4>
		<div style="margin-left : {$margin}em;">
			<xsl:apply-templates select="n1:text"/>
		</div>
		<xsl:for-each select="n1:component/n1:section">
			<xsl:call-template name="nestedSection">
				<xsl:with-param name="margin" select="2*$margin"/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	<xsl:template match="n1:paragraph">
		<p>
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template match="n1:pre">
		<pre>
			<xsl:apply-templates/>
		</pre>
	</xsl:template>
	<xsl:template match="n1:content[@revised='delete']"/>
	<xsl:template match="n1:content">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="n1:br">
		<xsl:element name='br'>
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="n1:list">
		<xsl:if test="n1:caption">
			<p>
				<b>
					<xsl:apply-templates select="n1:caption"/>
				</b>
			</p>
		</xsl:if>
		<ul>
			<xsl:for-each select="n1:item">
				<li>
					<xsl:apply-templates/>
				</li>
			</xsl:for-each>
		</ul>
	</xsl:template>
	<xsl:template match="n1:list[@listType='ordered']">
		<xsl:if test="n1:caption">
			<span style="font-weight:bold; ">
				<xsl:apply-templates select="n1:caption"/>
			</span>
		</xsl:if>
		<ol>
			<xsl:for-each select="n1:item">
				<li>
					<xsl:apply-templates/>
				</li>
			</xsl:for-each>
		</ol>
	</xsl:template>
	<xsl:template match="n1:caption">
		<xsl:apply-templates/>
		<xsl:text>: </xsl:text>
	</xsl:template>
	<xsl:template match="n1:table/@*|n1:thead/@*|n1:tfoot/@*|n1:tbody/@*|n1:colgroup/@*|n1:col/@*|n1:tr/@*|n1:th/@*|n1:td/@*">
		<xsl:copy>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="n1:table">
		<table class="narr_table">
			<xsl:copy-of select="@*"/>
			<xsl:attribute name="width" />
			<xsl:apply-templates/>
		</table>
	</xsl:template>
	<xsl:template match="n1:thead">
		<thead>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</thead>
	</xsl:template>
	<xsl:template match="n1:tfoot">
		<tfoot>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</tfoot>
	</xsl:template>
	<xsl:template match="n1:tbody">
		<tbody>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</tbody>
	</xsl:template>
	<xsl:template match="n1:colgroup">
		<colgroup>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</colgroup>
	</xsl:template>
	<xsl:template match="n1:col">
		<col>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</col>
	</xsl:template>
	<xsl:template match="n1:tr|tr">
		<xsl:param name="t">
			<xsl:apply-templates select="*" mode="t" />
		</xsl:param>
		<xsl:param name="same">
			<xsl:for-each select="preceding-sibling::*">
				<xsl:variable name="t1">
					<xsl:apply-templates select="*" mode="t" />
				</xsl:variable>
				<xsl:if test="$t1=$t">y</xsl:if>
			</xsl:for-each>
		</xsl:param>
		<xsl:param name="duplicateclass">
			<xsl:if test="$same!=''">duplicate</xsl:if>
		</xsl:param>
		<xsl:param name="tfirst">
			<xsl:value-of select="*/text()" />
		</xsl:param>
		<xsl:param name="duplicatefirstclass">
			<xsl:if test="normalize-space($tfirst)!='' and count(preceding-sibling::*[*/text()=$tfirst])>0">duplicatefirst</xsl:if>
		</xsl:param>
		<tr class="narr_tr {$duplicateclass} {$duplicatefirstclass}">
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</tr>
	</xsl:template>
	<xsl:template match="td" mode="t">
		<xsl:value-of select="text()" />
	</xsl:template>
	<xsl:template match="n1:th">
		<th class="narr_th">
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</th>
	</xsl:template>
	<xsl:template match="n1:td">
		<td class="td">
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</td>
	</xsl:template>
	<xsl:template match="n1:table/n1:caption">
		<span style="font-weight:bold; ">
			<xsl:apply-templates/>
		</span>
	</xsl:template>
	<xsl:template match="n1:renderMultiMedia">
		<xsl:variable name="imageRef" select="@referencedObject"/>
		<xsl:choose>
			<xsl:when test="//n1:regionOfInterest[@ID=$imageRef]">
				<xsl:if test="//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value[@mediaType='image/gif' or @mediaType='image/jpeg']">
					<br clear="all"/>
					<xsl:element name="img">
						<xsl:attribute name="src">
							<xsl:value-of select="//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value/n1:reference/@value"/>
						</xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="//n1:observationMedia[@ID=$imageRef]/n1:value[@mediaType='image/gif' or @mediaType='image/jpeg']">
					<br clear="all"/>
					<xsl:element name="img">
						<xsl:attribute name="src">
							<xsl:value-of select="//n1:observationMedia[@ID=$imageRef]/n1:value/n1:reference/@value"/>
						</xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="//n1:*[@styleCode][not(name()='tr' or name()='td')]">
		<xsl:if test="@styleCode='Bold'">
			<xsl:element name="b">
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>
		<xsl:if test="@styleCode='Italics'">
			<xsl:element name="i">
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>
		<xsl:if test="@styleCode='Underline'">
			<xsl:element name="u">
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Italics') and not (contains(@styleCode, 'Underline'))">
			<xsl:element name="b">
				<xsl:element name="i">
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Italics'))">
			<xsl:element name="b">
				<xsl:element name="u">
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Bold'))">
			<xsl:element name="i">
				<xsl:element name="u">
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and contains(@styleCode, 'Bold')">
			<xsl:element name="b">
				<xsl:element name="i">
					<xsl:element name="u">
						<xsl:apply-templates/>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="not (contains(@styleCode,'Italics') or contains(@styleCode,'Underline') or contains(@styleCode, 'Bold'))">
			<xsl:apply-templates/>
		</xsl:if>
	</xsl:template>
	<xsl:template match="n1:sup">
		<xsl:element name="sup">
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="n1:sub">
		<xsl:element name="sub">
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template name="show-sig">
		<xsl:param name="sig"/>
		<xsl:choose>
			<xsl:when test="$sig/@code =&apos;S&apos;">
				<xsl:text>signed</xsl:text>
			</xsl:when>
			<xsl:when test="$sig/@code=&apos;I&apos;">
				<xsl:text>intended</xsl:text>
			</xsl:when>
			<xsl:when test="$sig/@code=&apos;X&apos;">
				<xsl:text>signature required</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-id">
		<xsl:param name="id"/>
		<xsl:choose>
			<xsl:when test="not($id)">
				<xsl:if test="not(@nullFlavor)">
					<xsl:if test="@extension">
						<xsl:value-of select="@extension"/>
					</xsl:if>
					<xsl:text></xsl:text>
					<xsl:value-of select="@root"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="not($id/@nullFlavor)">
					<xsl:if test="$id/@extension">
						<xsl:value-of select="$id/@extension"/>
					</xsl:if>
					<xsl:text></xsl:text>
					<xsl:value-of select="$id/@root"/>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-name">
		<xsl:param name="name"/>
		<xsl:choose>
			<xsl:when test="$name/n1:family">
				<xsl:if test="$name/n1:prefix">
					<xsl:value-of select="$name/n1:prefix"/>
					<xsl:text> </xsl:text>
				</xsl:if>
				<xsl:value-of select="$name/n1:given"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="$name/n1:family"/>
				<xsl:if test="$name/n1:suffix">
					<xsl:text>, </xsl:text>
					<xsl:value-of select="$name/n1:suffix"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-gender">
		<xsl:choose>
			<xsl:when test="@code   = &apos;M&apos;">
				<i class="fa fa-mars"></i>
				<xsl:text>Male</xsl:text>
			</xsl:when>
			<xsl:when test="@code  = &apos;F&apos;">
				<i class="fa fa-venus"></i>
				<xsl:text>Female</xsl:text>
			</xsl:when>
			<xsl:when test="@code  = &apos;U&apos;">
				<xsl:text>Undifferentiated</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-race-ethnicity">
		<xsl:choose>
			<xsl:when test="@displayName">
				<xsl:value-of select="@displayName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@code"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-contactInfo">
		<xsl:param name="contact"/>
		<tr style="display:none" class="hide">
			<td bgcolor="#3399ff">
				<span class="td_label">
					<xsl:text>Contact info</xsl:text>
				</span>
			</td>
			<td colspan="3">
				<xsl:for-each select="$contact/n1:addr">
					<xsl:call-template name="show-address">
						<xsl:with-param name="address" select="."/>
					</xsl:call-template>
				</xsl:for-each>
				<xsl:for-each select="$contact/n1:telecom">
					<xsl:call-template name="show-telecom">
						<xsl:with-param name="telecom" select="."/>
					</xsl:call-template>
				</xsl:for-each>
			</td>
		</tr>
	</xsl:template>
	<xsl:template name="show-address">
		<xsl:param name="address"/>
		<xsl:choose>
			<xsl:when test="$address">
				<xsl:if test="$address/@use">
					<xsl:text></xsl:text>
					<xsl:call-template name="translateTelecomCode">
						<xsl:with-param name="code" select="$address/@use"/>
					</xsl:call-template>
					<xsl:text>:</xsl:text>
					<br/>
				</xsl:if>
				<xsl:for-each select="$address/n1:streetAddressLine">
					<xsl:value-of select="."/>
					<br/>
				</xsl:for-each>
				<xsl:if test="$address/n1:streetName">
					<xsl:value-of select="$address/n1:streetName"/>
					<xsl:text></xsl:text>
					<xsl:value-of select="$address/n1:houseNumber"/>
					<br/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:city)>0">
					<xsl:value-of select="$address/n1:city"/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:state)>0">
					<xsl:text>,&#160;</xsl:text>
					<xsl:value-of select="$address/n1:state"/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:postalCode)>0">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="$address/n1:postalCode"/>
				</xsl:if>
				<xsl:if test="string-length($address/n1:country)>0">
					<xsl:text>,&#160;</xsl:text>
					<xsl:value-of select="$address/n1:country"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>address not available</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<br/>
	</xsl:template>
	<xsl:template name="show-telecom">
		<xsl:param name="telecom"/>
		<xsl:choose>
			<xsl:when test="$telecom">
				<xsl:variable name="type" select="substring-before($telecom/@value, ':')"/>
				<xsl:variable name="value" select="substring-after($telecom/@value, ':')"/>
				<xsl:if test="$type">
					<xsl:call-template name="translateTelecomCode">
						<xsl:with-param name="code" select="$type"/>
					</xsl:call-template>
					<xsl:if test="@use">
						<xsl:text> (</xsl:text>
						<xsl:call-template name="translateTelecomCode">
							<xsl:with-param name="code" select="@use"/>
						</xsl:call-template>
						<xsl:text>)</xsl:text>
					</xsl:if>
					<xsl:text>: </xsl:text>
					<xsl:text></xsl:text>
					<xsl:value-of select="$value"/>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>Telecom information not available</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<br/>
	</xsl:template>
	<xsl:template name="show-recipientType">
		<xsl:param name="typeCode"/>
		<xsl:choose>
			<xsl:when test="$typeCode='PRCP'">Primary Recipient:</xsl:when>
			<xsl:when test="$typeCode='TRC'">Secondary Recipient:</xsl:when>
			<xsl:otherwise>Recipient:</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="translateTelecomCode">
		<xsl:param name="code"/>
		<xsl:choose>
			<xsl:when test="$code='tel'">
				<xsl:text>Tel</xsl:text>
			</xsl:when>
			<xsl:when test="$code='fax'">
				<xsl:text>Fax</xsl:text>
			</xsl:when>
			<xsl:when test="$code='http'">
				<xsl:text>Web</xsl:text>
			</xsl:when>
			<xsl:when test="$code='mailto'">
				<xsl:text>Mail</xsl:text>
			</xsl:when>
			<xsl:when test="$code='H'">
				<xsl:text>Home</xsl:text>
			</xsl:when>
			<xsl:when test="$code='HV'">
				<xsl:text>Vacation Home</xsl:text>
			</xsl:when>
			<xsl:when test="$code='HP'">
				<xsl:text>Primary Home</xsl:text>
			</xsl:when>
			<xsl:when test="$code='MC'">
				<xsl:text>Mobile Contact</xsl:text>
			</xsl:when>
			<xsl:when test="$code='WP'">
				<xsl:text>Work Place</xsl:text>
			</xsl:when>
			<xsl:when test="$code='PUB'">
				<xsl:text>Pub</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>{$code='</xsl:text>
				<xsl:value-of select="$code"/>
				<xsl:text>'?}</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="translateRoleAssoCode">
		<xsl:param name="classCode"/>
		<xsl:param name="code"/>
		<xsl:choose>
			<xsl:when test="$classCode='AFFL'">
				<xsl:text>affiliate</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='AGNT'">
				<xsl:text>agent</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='ASSIGNED'">
				<xsl:text>assigned entity</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='COMPAR'">
				<xsl:text>commissioning party</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='CON'">
				<xsl:text>contact</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='ECON'">
				<xsl:text>emergency contact</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='NOK'">
				<xsl:text>next of kin</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='SGNOFF'">
				<xsl:text>signing authority</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='GUARD'">
				<xsl:text>guardian</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='GUAR'">
				<xsl:text>guardian</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='CIT'">
				<xsl:text>citizen</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='COVPTY'">
				<xsl:text>covered party</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='PRS'">
				<xsl:text>personal relationship</xsl:text>
			</xsl:when>
			<xsl:when test="$classCode='CAREGIVER'">
				<xsl:text>care giver</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>{$classCode='</xsl:text>
				<xsl:value-of select="$classCode"/>
				<xsl:text>'?}</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="($code/@code) and ($code/@codeSystem='2.16.840.1.113883.5.111')">
			<xsl:text></xsl:text>
			<xsl:choose>
				<xsl:when test="$code/@code='FTH'">
					<xsl:text>(Father)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='MTH'">
					<xsl:text>(Mother)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='NPRN'">
					<xsl:text>(Natural parent)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='STPPRN'">
					<xsl:text>(Step parent)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='SONC'">
					<xsl:text>(Son)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='DAUC'">
					<xsl:text>(Daughter)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='CHILD'">
					<xsl:text>(Child)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='EXT'">
					<xsl:text>(Extended family member)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='NBOR'">
					<xsl:text>(Neighbor)</xsl:text>
				</xsl:when>
				<xsl:when test="$code/@code='SIGOTHR'">
					<xsl:text>(Significant other)</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>{$code/@code='</xsl:text>
					<xsl:value-of select="$code/@code"/>
					<xsl:text>'?}</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
	<xsl:template name="show-time">
		<xsl:param name="datetime"/>
		<xsl:choose>
			<xsl:when test="not($datetime)">
				<xsl:call-template name="formatDateTime">
					<xsl:with-param name="date" select="@value"/>
				</xsl:call-template>
				<xsl:text></xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateTime">
					<xsl:with-param name="date" select="$datetime/@value"/>
				</xsl:call-template>
				<xsl:text></xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="facilityAndDates">
		<table class="header_table">
			<tbody>
				<tr>
					<td bgcolor="#3399ff">
						<span class="td_label">
							<xsl:text>Facility ID</xsl:text>
						</span>
					</td>
					<td colspan="3">
						<xsl:choose>
							<xsl:when test="count(/n1:ClinicalDocument/n1:participant
									  [@typeCode='LOC'][@contextControlCode='OP']
									  /n1:associatedEntity[@classCode='SDLOC']/n1:id)&gt;0">
								<xsl:for-each select="/n1:ClinicalDocument/n1:participant
									  [@typeCode='LOC'][@contextControlCode='OP']
									  /n1:associatedEntity[@classCode='SDLOC']/n1:id">
									<xsl:call-template name="show-id"/>
									<xsl:for-each select="../n1:code">
										<xsl:text> (</xsl:text>
										<xsl:call-template name="show-code">
											<xsl:with-param name="code" select="."/>
										</xsl:call-template>
										<xsl:text>)</xsl:text>
									</xsl:for-each>
								</xsl:for-each>
							</xsl:when>
							<xsl:otherwise>
				 Not available
							 </xsl:otherwise>
						</xsl:choose>
					</td>
				</tr>
				<tr>
					<td bgcolor="#3399ff">
						<span class="td_label">
							<xsl:text>First day of period reported</xsl:text>
						</span>
					</td>
					<td colspan="3">
						<xsl:call-template name="show-time">
							<xsl:with-param name="datetime" select="/n1:ClinicalDocument/n1:documentationOf
									  /n1:serviceEvent/n1:effectiveTime/n1:low"/>
						</xsl:call-template>
					</td>
				</tr>
				<tr>
					<td bgcolor="#3399ff">
						<span class="td_label">
							<xsl:text>Last day of period reported</xsl:text>
						</span>
					</td>
					<td colspan="3">
						<xsl:call-template name="show-time">
							<xsl:with-param name="datetime" select="/n1:ClinicalDocument/n1:documentationOf
									  /n1:serviceEvent/n1:effectiveTime/n1:high"/>
						</xsl:call-template>
					</td>
				</tr>
			</tbody>
		</table>
	</xsl:template>
	<xsl:template name="show-assignedEntity">
		<xsl:param name="asgnEntity"/>
		<xsl:choose>
			<xsl:when test="$asgnEntity/n1:assignedPerson/n1:name">
				<xsl:call-template name="show-name">
					<xsl:with-param name="name" select="$asgnEntity/n1:assignedPerson/n1:name"/>
				</xsl:call-template>
				<xsl:if test="$asgnEntity/n1:representedOrganization/n1:name">
					<xsl:text> of </xsl:text>
					<xsl:value-of select="$asgnEntity/n1:representedOrganization/n1:name"/>
				</xsl:if>
			</xsl:when>
			<xsl:when test="$asgnEntity/n1:representedOrganization">
				<xsl:value-of select="$asgnEntity/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:for-each select="$asgnEntity/n1:id">
					<xsl:call-template name="show-id"/>
					<xsl:choose>
						<xsl:when test="position()!=last()">
							<xsl:text>, </xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<br/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-relatedEntity">
		<xsl:param name="relatedEntity"/>
		<xsl:choose>
			<xsl:when test="$relatedEntity/n1:relatedPerson/n1:name">
				<xsl:call-template name="show-name">
					<xsl:with-param name="name" select="$relatedEntity/n1:relatedPerson/n1:name"/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-associatedEntity">
		<xsl:param name="assoEntity"/>
		<xsl:choose>
			<xsl:when test="$assoEntity/n1:associatedPerson">
				<xsl:for-each select="$assoEntity/n1:associatedPerson/n1:name">
					<xsl:call-template name="show-name">
						<xsl:with-param name="name" select="."/>
					</xsl:call-template>
					<br/>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$assoEntity/n1:scopingOrganization">
				<xsl:for-each select="$assoEntity/n1:scopingOrganization">
					<xsl:if test="n1:name">
						<xsl:call-template name="show-name">
							<xsl:with-param name="name" select="n1:name"/>
						</xsl:call-template>
						<br/>
					</xsl:if>
					<xsl:if test="n1:standardIndustryClassCode">
						<xsl:value-of select="n1:standardIndustryClassCode/@displayName"/>
						<xsl:text> code:</xsl:text>
						<xsl:value-of select="n1:standardIndustryClassCode/@code"/>
					</xsl:if>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$assoEntity/n1:code">
				<xsl:call-template name="show-code">
					<xsl:with-param name="code" select="$assoEntity/n1:code"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$assoEntity/n1:id">
				<xsl:value-of select="$assoEntity/n1:id/@extension"/>
				<xsl:text></xsl:text>
				<xsl:value-of select="$assoEntity/n1:id/@root"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-code">
		<xsl:param name="code"/>
		<xsl:variable name="this-codeSystem">
			<xsl:value-of select="$code/@codeSystem"/>
		</xsl:variable>
		<xsl:variable name="this-code">
			<xsl:value-of select="$code/@code"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$code/n1:originalText">
				<xsl:value-of select="$code/n1:originalText"/>
			</xsl:when>
			<xsl:when test="$code/@displayName">
				<xsl:value-of select="$code/@displayName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$this-code"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-actClassCode">
		<xsl:param name="clsCode"/>
		<xsl:choose>
			<xsl:when test=" $clsCode = 'ACT' ">
				<xsl:text>healthcare service</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ACCM' ">
				<xsl:text>accommodation</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ACCT' ">
				<xsl:text>account</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ACSN' ">
				<xsl:text>accession</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ADJUD' ">
				<xsl:text>financial adjudication</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'CONS' ">
				<xsl:text>consent</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'CONTREG' ">
				<xsl:text>container registration</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'CTTEVENT' ">
				<xsl:text>clinical trial timepoint event</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'DISPACT' ">
				<xsl:text>disciplinary action</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'ENC' ">
				<xsl:text>encounter</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'INC' ">
				<xsl:text>incident</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'INFRM' ">
				<xsl:text>inform</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'INVE' ">
				<xsl:text>invoice element</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'LIST' ">
				<xsl:text>working list</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'MPROT' ">
				<xsl:text>monitoring program</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'PCPR' ">
				<xsl:text>care provision</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'PROC' ">
				<xsl:text>procedure</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'REG' ">
				<xsl:text>registration</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'REV' ">
				<xsl:text>review</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'SBADM' ">
				<xsl:text>substance administration</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'SPCTRT' ">
				<xsl:text>speciment treatment</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'SUBST' ">
				<xsl:text>substitution</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'TRNS' ">
				<xsl:text>transportation</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'VERIF' ">
				<xsl:text>verification</xsl:text>
			</xsl:when>
			<xsl:when test=" $clsCode = 'XACT' ">
				<xsl:text>financial transaction</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-participationType">
		<xsl:param name="ptype"/>
		<xsl:choose>
			<xsl:when test=" $ptype='PPRF' ">
				<xsl:text>primary performer</xsl:text>
			</xsl:when>
			<xsl:when test=" $ptype='PRF' ">
				<xsl:text>performer</xsl:text>
			</xsl:when>
			<xsl:when test=" $ptype='VRF' ">
				<xsl:text>verifier</xsl:text>
			</xsl:when>
			<xsl:when test=" $ptype='SPRF' ">
				<xsl:text>secondary performer</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="show-participationFunction">
		<xsl:param name="pFunction"/>
		<xsl:choose>
			<xsl:when test=" $pFunction = 'ADMPHYS' ">
				<xsl:text>(admitting physician)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'ANEST' ">
				<xsl:text>(anesthesist)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'ANRS' ">
				<xsl:text>(anesthesia nurse)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'ATTPHYS' ">
				<xsl:text>(attending physician)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'DISPHYS' ">
				<xsl:text>(discharging physician)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'FASST' ">
				<xsl:text>(first assistant surgeon)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'MDWF' ">
				<xsl:text>(midwife)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'NASST' ">
				<xsl:text>(nurse assistant)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'PCP' ">
				<xsl:text>(primary care physician)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'PRISURG' ">
				<xsl:text>(primary surgeon)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'RNDPHYS' ">
				<xsl:text>(rounding physician)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'SASST' ">
				<xsl:text>(second assistant surgeon)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'SNRS' ">
				<xsl:text>(scrub nurse)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'TASST' ">
				<xsl:text>(third assistant)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'CP' ">
				<xsl:text>(consulting provider)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'PP' ">
				<xsl:text>(primary care provider)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'RP' ">
				<xsl:text>(referring provider)</xsl:text>
			</xsl:when>
			<xsl:when test=" $pFunction = 'MP' ">
				<xsl:text>(medical home provider)</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="formatDateTime">
		<xsl:param name="date"/>
		<xsl:variable name="month" select="substring ($date, 5, 2)"/>
		<xsl:choose>
			<xsl:when test="$month='01'">
				<xsl:text>January </xsl:text>
			</xsl:when>
			<xsl:when test="$month='02'">
				<xsl:text>February </xsl:text>
			</xsl:when>
			<xsl:when test="$month='03'">
				<xsl:text>March </xsl:text>
			</xsl:when>
			<xsl:when test="$month='04'">
				<xsl:text>April </xsl:text>
			</xsl:when>
			<xsl:when test="$month='05'">
				<xsl:text>May </xsl:text>
			</xsl:when>
			<xsl:when test="$month='06'">
				<xsl:text>June </xsl:text>
			</xsl:when>
			<xsl:when test="$month='07'">
				<xsl:text>July </xsl:text>
			</xsl:when>
			<xsl:when test="$month='08'">
				<xsl:text>August </xsl:text>
			</xsl:when>
			<xsl:when test="$month='09'">
				<xsl:text>September </xsl:text>
			</xsl:when>
			<xsl:when test="$month='10'">
				<xsl:text>October </xsl:text>
			</xsl:when>
			<xsl:when test="$month='11'">
				<xsl:text>November </xsl:text>
			</xsl:when>
			<xsl:when test="$month='12'">
				<xsl:text>December </xsl:text>
			</xsl:when>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test='substring ($date, 7, 1)="0"'>
				<xsl:value-of select="substring ($date, 8, 1)"/>
				<xsl:text>, </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring ($date, 7, 2)"/>
				<xsl:text>, </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="substring ($date, 1, 4)"/>
		<xsl:if test="string-length($date) > 8">
			<xsl:text>, </xsl:text>
			<xsl:variable name="time">
				<xsl:value-of select="substring($date,9,6)"/>
			</xsl:variable>
			<xsl:variable name="hh">
				<xsl:value-of select="substring($time,1,2)"/>
			</xsl:variable>
			<xsl:variable name="mm">
				<xsl:value-of select="substring($time,3,2)"/>
			</xsl:variable>
			<xsl:variable name="ss">
				<xsl:value-of select="substring($time,5,2)"/>
			</xsl:variable>
			<xsl:if test="string-length($hh)&gt;1">
				<xsl:value-of select="$hh"/>
				<xsl:if test="string-length($mm)&gt;1 and not(contains($mm,'-')) and not (contains($mm,'+'))">
					<xsl:text>:</xsl:text>
					<xsl:value-of select="$mm"/>
					<xsl:if test="string-length($ss)&gt;1 and not(contains($ss,'-')) and not (contains($ss,'+'))">
						<xsl:text>:</xsl:text>
						<xsl:value-of select="$ss"/>
					</xsl:if>
				</xsl:if>
			</xsl:if>
			<xsl:variable name="tzon">
				<xsl:choose>
					<xsl:when test="contains($date,'+')">
						<xsl:text>+</xsl:text>
						<xsl:value-of select="substring-after($date, '+')"/>
					</xsl:when>
					<xsl:when test="contains($date,'-')">
						<xsl:text>-</xsl:text>
						<xsl:value-of select="substring-after($date, '-')"/>
					</xsl:when>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$tzon = '-0500' ">
					<xsl:text>, EST</xsl:text>
				</xsl:when>
				<xsl:when test="$tzon = '-0600' ">
					<xsl:text>, CST</xsl:text>
				</xsl:when>
				<xsl:when test="$tzon = '-0700' ">
					<xsl:text>, MST</xsl:text>
				</xsl:when>
				<xsl:when test="$tzon = '-0800' ">
					<xsl:text>, PST</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text></xsl:text>
					<xsl:value-of select="$tzon"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
	<xsl:template name="caseDown">
		<xsl:param name="data"/>
		<xsl:if test="$data">
			<xsl:value-of select="translate($data, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
		</xsl:if>
	</xsl:template>
	<xsl:template name="caseUp">
		<xsl:param name="data"/>
		<xsl:if test="$data">
			<xsl:value-of select="translate($data,'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
		</xsl:if>
	</xsl:template>
	<xsl:template name="firstCharCaseUp">
		<xsl:param name="data"/>
		<xsl:if test="$data">
			<xsl:call-template name="caseUp">
				<xsl:with-param name="data" select="substring($data,1,1)"/>
			</xsl:call-template>
			<xsl:value-of select="substring($data,2)"/>
		</xsl:if>
	</xsl:template>
	<xsl:template name="show-noneFlavor">
		<xsl:param name="nf"/>
		<xsl:choose>
			<xsl:when test=" $nf = 'NI' ">
				<xsl:text>no information</xsl:text>
			</xsl:when>
			<xsl:when test=" $nf = 'INV' ">
				<xsl:text>invalid</xsl:text>
			</xsl:when>
			<xsl:when test=" $nf = 'MSK' ">
				<xsl:text>masked</xsl:text>
			</xsl:when>
			<xsl:when test=" $nf = 'NA' ">
				<xsl:text>not applicable</xsl:text>
			</xsl:when>
			<xsl:when test=" $nf = 'UNK' ">
				<xsl:text>unknown</xsl:text>
			</xsl:when>
			<xsl:when test=" $nf = 'OTH' ">
				<xsl:text>other</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="addCSS">
		<style type="text/css">
			<xsl:text></xsl:text>
		</style>
	</xsl:template>
</xsl:stylesheet>`;

window.addEventListener("message", arg => {
    // if (arg.origin !== origin) return;

    /**
     * @description To found out the intermittent issue
     */
    window.parent.postMessage({
        action: "CCDA_IFRAME_DATA_LOADED",
    });

    if (arg?.data?.data?.firstsection) {
        localStorage.setItem("firstsection", arg?.data?.data?.firstsection);
    }
    if (arg?.data?.data?.hidden) {
        localStorage.setItem("hidden", arg?.data?.data?.hidden);
    }
    cdaxml = arg.data.data.data;
    loadCCDAViewer();
});

// $(document).ready(function () {
// 	$('.viewbtn').off('click').click(function () {
// 		var id_target = $(this).attr('id_target');
// 		$('.cdaview:not([id="' + id_target + '"])').hide()
// 		$('#' + id_target).show()
// 	})
// 	init()
// 	$('#ghrepos').click(function () {
// 		ghowner = $('#ghowner').val()
// 		var url = 'https://api.github.com/users/' + ghowner + '/repos?sort=asc';
// 		$.get(url, function (data) {
// 			loadrepos(data)
// 		});
// 	})
// 	$('#ghsearch').click(function () {
// 		s = $('#ghowner').val()
// 		var url = 'https://api.github.com/search/repositories?q=' + s + '&sort=stars&order=desc';
// 		$.get(url, function (data) {
// 			loadrepos(data)
// 		});
// 	})
// 	$('#fileInput').change(function () {
// 		startProcessing($("#fileInput"), populateResults, populateError, populateProgress);
// 	})

// 	init()

// 	setTimeout(() => {
// 		new Transformation().setXml(cdaxml).setXslt(cdaxsl).transform("viewcda");
// 		setTimeout(() => {
// 			init()
// 		}, 1000)
// 	}, 1000)
// })

function loadCCDAViewer() {
    $("#viewcda").html("");
    setTimeout(() => {
        new Transformation()
            .setCallback(() => {
                setTimeout(() => {
                    init();
                }, 300);
            })
            .setXml(cdaxml)
            .setXslt(cdaxsl)
            .transform("viewcda");
        $("#viewcda").append(
            '<p style="text-align: center; font-size: 8pt; font-weight: bold;">CONFIDENTIAL</p>'
        );
    }, 300);
}

function sendDataToParentWindow() {
    window.parent.postMessage({
        action: "UPDATE_USER_CCDA_CONFIGURATION",
    });
}

function loadrepos(xhr) {
    var ojson = xhr;
    if (xhr.items !== undefined) ojson = xhr.items;
    else ojson = xhr;
    var s = "";
    for (var i = 0, j = ojson.length; i < j; i++) {
        o = ojson[i];
        s =
            s +
            '<p class="pure-button loadrepo" owner="' +
            o.owner.login +
            '" path="" title="' +
            o["description"] +
            '" reponame="' +
            o["name"] +
            '">' +
            o["name"] +
            "</p>";
    }
    $("#github").html(s);

    $("#github")
        .find(".loadrepo")
        .off("click")
        .click(function () {
            var reponame = $(this).attr("reponame");
            var owner = $(this).attr("owner");
            var url = "https://api.github.com/repos/" + owner + "/" + reponame + "/contents";
            $.get(url, function (data) {
                loadcontents(data, reponame, owner, "");
            }).fail(function () {
                alert("Error - failed to retrieve data.");
            });
        });
}

function loadcontents(data, reponame, owner, path) {
    var ojson = data;
    var s = "";
    if (path.indexOf("/") != -1) {
        path = path.substring(0, path.indexOf("/"));
    } else path = "";
    s =
        s +
        '<p class="pure-button loadrepo" path="' +
        path +
        '" owner="' +
        owner +
        '" reponame="' +
        reponame +
        '">..<i class="fa fa-level-up" /></p>';
    for (var i = 0, j = ojson.length; i < j; i++) {
        o = ojson[i];
        if (o["type"] == "file" && o["name"].indexOf(".xml") > 0)
            s =
                s +
                '<p class="pure-button transform" file="' +
                o["download_url"] +
                '"><i class="fa fa-angle-double-right"></i>' +
                o["name"] +
                "</p>";
        else if (o["type"] == "dir") {
            s =
                s +
                '<p class="pure-button loadrepo" path="' +
                o["path"] +
                '" owner="' +
                owner +
                '" reponame="' +
                reponame +
                '"><i class="fa fa-folder" /> ' +
                o["name"] +
                "</p>";
        }
    }
    $("#github").html(s);

    $("#github")
        .find(".loadrepo")
        .off("click")
        .click(function () {
            var url =
                "https://api.github.com/repos/" +
                $(this).attr("owner") +
                "/" +
                $(this).attr("reponame") +
                "/contents/" +
                $(this).attr("path");
            var reponame = $(this).attr("reponame");
            var owner = $(this).attr("owner");
            var path = $(this).attr("path");
            $.get(url, function (data) {
                loadcontents(data, reponame, owner, path);
            }).fail(function () {
                alert("Error - failed to retrieve data.");
            });
        });
    $("#github")
        .find(".transform")
        .off("click")
        .click(function () {
            $("#viewcda").html("");
            if ($(this).attr("file") != undefined) {
                cdaxml = $(this).attr("file");
            }
            new Transformation().setXml(cdaxml).setXslt("cda.xsl").transform("viewcda");
            $("#viewcda").append(
                '<p style="text-align: center; font-size: 8pt; font-weight: bold;">CONFIDENTIAL</p>'
            );
        });
}

function init() {
    sectionorder = [];

    $("li.toc[data-code]").each(function () {
        sectionorder.push($(this).attr("data-code"));
        /*
		$(this).hover(
			function(){
				var section=$('.section[data-code="'+$(this).attr('data-code')+'"] > .section_in')
				section.addClass('sectionhover')
			},
			function(){
				var section=$('.section[data-code="'+$(this).attr('data-code')+'"] > .section_in')
				section.removeClass('sectionhover')
			}
		)
		*/
    });

    $(".minimise")
        .off("click")
        .click(function (event) {
            var section = $(this).closest(".section");
            $(this).toggleClass("fa-compress fa-expand");
            var sectiondiv = $(this).parent().parent().find("div:last");
            sectiondiv.slideToggle(function () {
                adjustWidth(section);
            });
        });
    var cdabody = $("#cdabody");

    cdabody.find("div.section").each(function () {
        var sect = $(this);
        $(this).hover(
            function () {
                $(this).find(".controls").show();
            },
            function () {
                $(this).find(".controls").hide();
            }
        );
        $(this)
            .find("table")
            .each(function () {
                var tbl = $(this);
                if (tbl.width() > sect.width()) sect.width(tbl.width() + 20);

                var c = tbl.find("tr.duplicate").length;
                if (c > 0) {
                    if (c == 1)
                        var s = $(
                            '<tr class="all" style="cursor:pointer"><td colspan="5"><i class="fa fa-warning"></i> (' +
                                c +
                                ') duplicate row hidden. Click here to <span class="show">show</span>.</td></tr>'
                        );
                    else
                        var s = $(
                            '<tr class="all" style="cursor:pointer"><td colspan="5"><i class="fa fa-warning"></i> (' +
                                c +
                                ') duplicate rows hidden. Click here to <span class="show">show</span>.</td></tr>'
                        );
                    tbl.prepend(s).on("click", "tr.all", function () {
                        if ($(this).find(".show").text() == "show") {
                            $(this).find(".show").text("hide");
                            tbl.find("tr.duplicate").show();
                        } else {
                            $(this).find(".show").text("show");
                            tbl.find("tr.duplicate").hide();
                        }
                        $("#cdabody").packery();
                    });
                }
                c = tbl.find("tr.duplicatefirst").length;
                if (c > 0) {
                    if (c == 1)
                        var s = $(
                            '<tr class="first" style="cursor:pointer"><td colspan="5"><i class="fa fa-question-circle"></i> (' +
                                c +
                                ') potential duplicate row. Click here to <span class="show1">hide</span>.</td></tr>'
                        );
                    else
                        var s = $(
                            '<tr class="first" style="cursor:pointer"><td colspan="5"><i class="fa fa-question-circle"></i> (' +
                                c +
                                ') potential duplicate row. Click here to <span class="show1">hide</span>.</td></tr>'
                        );
                    tbl.prepend(s).on("click", "tr.first", function () {
                        if ($(this).find(".show1").text() == "show") {
                            $(this).find(".show1").text("hide");
                            tbl.find("tr.duplicatefirst").show();
                        } else {
                            $(this).find(".show1").text("show");
                            tbl.find("tr.duplicatefirst").hide();
                        }
                        $("#cdabody").packery();
                    });
                }
                //Turns on table sorting: User clicks on column header to sort the rows. Only sorts AB. Needs extension to date sorting before it is useful.
                /*
			tbl.find('th').click(function(){
				var table = $(this).parents('table').eq(0)
				var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
				this.asc = !this.asc
				if (!this.asc)
					{rows = rows.reverse()}
				for (var i = 0; i < rows.length; i++){table.append(rows[i])}
			})
			*/
            });
    });

    cdabody.packery({
        stamp: ".stamp",
        columnWidth: "div.section:not(.narr_table)",
        //columnWidth: 160,
        transitionDuration: "0.2s",
        itemSelector: "div.section",
        gutter: 10,
    });

    cdabody.find("div.section:not(.recordTarget)").each(function (i, gridItem) {
        var draggie = new Draggabilly(gridItem);
        // bind drag events to Packery
        cdabody.packery("bindDraggabillyEvents", draggie);
    });

    cdabody.on("dragItemPositioned", function () {
        orderItems();
    });
    $(".toc")
        .off("click")
        .click(function () {
            var section = $('.section[data-code="' + $(this).attr("data-code") + '"]');
            if (section.is(":visible")) {
                section.fadeOut(function () {
                    $("#cdabody").packery();
                    if (hidden.indexOf(section.attr("data-code")) == -1) {
                        hidden.push(section.attr("data-code"));
                        localStorage.setItem("hidden", hidden);
                        sendDataToParentWindow();
                    }
                });
                $(this).addClass("hide");
                $(this).find("i.tocli").removeClass("fa-check-square-o").addClass("fa-square-o");
            } else {
                section.addClass("fadehighlight").fadeIn(function () {
                    $("#cdabody").packery();
                    $(this).removeClass("fadehighlight");
                    hidden.splice(hidden.indexOf(section.attr("data-code")), 1);
                    localStorage.setItem("hidden", hidden);
                    sendDataToParentWindow();
                });
                $(this).removeClass("hide");
                $(this).find("i.tocli").removeClass("fa-square-o").addClass("fa-check-square-o");
            }
            th = $("#tochead");
            if ($("li.hide.toc[data-code]").length != 0) {
                if (th.find("i.fa-warning").length == 0)
                    th.prepend(
                        '<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="Sections are hidden"></i>'
                    );
            } else {
                th.find("i.fa-warning").remove();
            }
        });
    $("#tochead")
        .off("click")
        .click(function () {
            $("#toc").slideToggle(function () {
                $("#cdabody").packery();
            });
        });
    $(".tocup")
        .off("click")
        .click(function (event) {
            var li = $(this).parent();
            var section = $('.section[data-code="' + li.attr("data-code") + '"]');
            moveup(section, li, true);
            event.stopPropagation();
            event.preventDefault();
        });
    $(".tocdown")
        .off("click")
        .click(function (event) {
            var li = $(this).parent();
            var section = $('.section[data-code="' + li.attr("data-code") + '"]');
            movedown(section, li, true);
            event.stopPropagation();
            event.preventDefault();
        });
    $(".sectionup")
        .off("click")
        .click(function (event) {
            var section = $(this).closest(".section");
            var li = $('.toc[data-code="' + section.attr("data-code") + '"]');
            moveup(section, li, true);
        });
    $(".sectiondown")
        .off("click")
        .click(function (event) {
            var section = $(this).closest(".section");
            var li = $('.toc[data-code="' + section.attr("data-code") + '"]');
            movedown(section, li, true);
        });

    $(".hideshow")
        .off("click")
        .click(function () {
            var up = $(this).find("i").hasClass("fa-compress");

            if (up) {
                $("div.sectiontext").slideUp(function () {
                    adjustWidth($(this).parent().parent());
                });
                $(".minimise").addClass("fa-expand").removeClass("fa-compress");
            } else {
                $("div.sectiontext").slideDown(function () {
                    adjustWidth($(this).parent().parent());
                });
                $(".minimise").addClass("fa-compress").removeClass("fa-expand");
            }
            $("#cdabody").packery();
            $(".hideshow").find("i").toggleClass("fa-compress fa-expand");
            //$('.minimise').toggleClass('fa-compress fa-expand')
            localStorage.setItem("collapseall", up);
        });

    $("#restore")
        .off("click")
        .click(function () {
            // $("#viewcda").html();
            localStorage.setItem("firstsection", []);
            // new Transformation().setXml(cdaxml).setXslt("cda.xsl").transform("viewcda");
            // alert("Order is restored");
            // init();
            loadCCDAViewer();
            sendDataToParentWindow();

            //location.reload()
        });
    $("#showall")
        .off("click")
        .click(function () {
            localStorage.setItem("hidden", []);
            //var section=$(this).closest('div.section')
            $(".section").each(function () {
                $(this).show();
                var code = $(this).attr("data-code");
                $('.toc[data-code="' + code + '"]')
                    .removeClass("hide")
                    .find("i.tocli")
                    .addClass("fa-check-square-o")
                    .removeClass("fa-square-o");
            });
            $("#cdabody").packery();
            sendDataToParentWindow();
        });
    $(".transform")
        .off("click")
        .click(function () {
            // $("#viewcda").html("");
            // if ($(this).attr("file") != undefined) {
            //     cdaxml = $(this).attr("file");
            // } else {
            //     cdaxml = $("#cdaxml").val();
            // }

            //jquery $('#viewcda').xslt(cdaxml, './cda.xsl');

            // new Transformation().setXml(cdaxml).setXslt("cda.xsl").transform("viewcda");
            //$('#inputcda').hide(function(){
            //$('#viewcda').show(function(){
            //init()
            //$('#inputcdabtn').show()
            //})
            //})
            loadCCDAViewer();
        });
    $("i.delete")
        .off("click")
        .click(function () {
            var section = $(this).closest("div.section");
            section.fadeOut(function () {
                var code = section.attr("data-code");
                if (hidden.indexOf(code) == -1) {
                    hidden.push(code);
                    localStorage.setItem("hidden", hidden);
                    sendDataToParentWindow();
                }
                cdabody.packery();
                $('.toc[data-code="' + code + '"]')
                    .addClass("hide")
                    .find("i.tocli")
                    .removeClass("fa-check-square-o")
                    .addClass("fa-square-o");
                th = $("#tochead");
                if ($("li.hide.toc[data-code]").length != 0) {
                    if (th.find("i.fa-warning").length == 0)
                        th.prepend(
                            '<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="Sections are hidden"></i>'
                        );
                } else {
                    th.find("i.fa-warning").remove();
                }
            });
        });

    if (typeof Storage !== "undefined" && localStorage != undefined) {
        collapseall = localStorage.collapseall;
        //alert(collapseall)
        if (collapseall == undefined || collapseall == "false") {
            $("div.sectiontext").show(function () {
                //adjustWidth($(this).parent().parent())
            });
            $(".hideshow").find("i").addClass("fa-compress").removeClass("fa-expand");
            $(".minimise").addClass("fa-compress").removeClass("fa-expand");
        } else {
            $("div.sectiontext").hide(function () {
                //alert('asdf')
                adjustWidth($(this).parent().parent());
            });
            $(".hideshow").find("i").addClass("fa-expand").removeClass("fa-compress");

            //$('.minimise').toggleClass('fa-compress fa-expand')
        }

        if (localStorage?.hidden || localStorage?.firstsection) {
            hidden = localStorage?.hidden?.split(",") || [];
            if (hidden.length > 0) {
                var ihid = 0;
                for (i = 0; i < hidden.length; i++) {
                    if (hidden[i] !== undefined && hidden[i] != "") {
                        var section = $('.section[data-code="' + hidden[i] + '"]');
                        section.hide();
                        $('.toc[data-code="' + hidden[i] + '"]')
                            .addClass("hide")
                            .find("i.tocli")
                            .removeClass("fa-check-square-o")
                            .addClass("fa-square-o");
                        ihid++;
                    }
                }
                if (ihid > 0) {
                    th = $("#tochead");
                    th.prepend(
                        '<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="' +
                            ihid +
                            ' sections are hidden"></i>'
                    );
                }
            }

            firstsection = localStorage?.firstsection?.split(",") || [];
            if (firstsection.length > 1) {
                for (i = firstsection.length - 1; i > -1; i--) {
                    if (firstsection[i] !== undefined && firstsection[i] != "") {
                        var section = $('.section[data-code="' + firstsection[i] + '"]');
                        var li = $('.toc[data-code="' + section.attr("data-code") + '"]');
                        moveup(section, li, false);
                        sectionorder.splice(sectionorder.indexOf(firstsection[i]), 1);
                    }
                }
            }
        }

        for (i = 0; i < sectionorder.length; i++) {
            firstsection.push(sectionorder[i]);
        }
        $("#cdabody").packery("reloadItems");
        $("#cdabody").packery();
    } else {
        $("#storagemsg").text(
            "Your browser does not have localStorage - your preferences will not be saved"
        );
    }
}

function adjustWidth(section) {
    s = section.attr("style");
    var is = s.indexOf("width:");

    if (is > -1) {
        var ie = s.indexOf("px;");
        sStart = s.substring(0, is);
        sEnd = s.substring(is, s.length);
        ie = sEnd.indexOf("px;");
        sEnd = sEnd.substring(ie + 3, sEnd.length);
        s = sStart + sEnd;
        section.attr("style", s);
    }

    if (section.find("table").length > 0) {
        if (section.find("table").width() > section.width())
            section.width(section.find("table").width() + 20);
    }
    $("#cdabody").packery();
}

function moveup(section, li, bRefresh) {
    var curr = li;
    curr.fadeOut(function () {
        var t = li.parent().find("li:first");
        t.before(curr);
        curr.fadeIn();
    });

    //section
    f = section.parent().find("div.section:eq(0)");
    f.before(section);
    if (bRefresh) {
        var code = section.attr("data-code");
        if (firstsection.indexOf(code) == -1) {
            firstsection.unshift(code);
        } else {
            firstsection.splice(firstsection.indexOf(code), 1);
            firstsection.unshift(code);
        }
        localStorage.setItem("firstsection", firstsection);
        sendDataToParentWindow();
        $("#cdabody").packery("reloadItems");
        $("#cdabody").packery();
    }
}

function movedown(section, li, bRefresh) {
    curr = li;
    curr.fadeOut(function () {
        t = curr.next("[data-code]");
        t.after(curr);
        curr.fadeIn();
    });

    //f=section.parent().find('div.section:eq(1)')
    f = section.next();
    f.after(section);
    if (bRefresh) {
        var code = section.attr("data-code");
        if (firstsection.indexOf(code) == -1) {
            firstsection.unshift(code);
        } else {
            var pos = firstsection.indexOf(code);
            if (pos < firstsection.length) {
                var b = firstsection[pos + 1];
                firstsection[pos + 1] = firstsection[pos];
                firstsection[pos] = b;
            }
            localStorage.setItem("firstsection", firstsection);
            sendDataToParentWindow();
        }
        $("#cdabody").packery("reloadItems");
        $("#cdabody").packery();
    }
}

function orderItems() {
    firstsection = [];
    restore = $("#restore");
    var itemElems = $("#cdabody").packery("getItemElements");
    $(itemElems).each(function (i, itemElem) {
        var code = $(itemElem).attr("data-code");
        firstsection.push(code);
        li = $('.toc[data-code="' + code + '"]');
        restore.before(li);
    });
    localStorage.setItem("firstsection", firstsection);
    sendDataToParentWindow();
}

function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index),
            valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    };
}

function getCellValue(row, index) {
    return $(row).children("td").eq(index).html();
}

var xmload;
function loadtextarea(fname) {
    xmload = new XMLHttpRequest();
    xmload.onreadystatechange = loaded;
    try {
        xmload.open("GET", fname, true);
    } catch (e) {
        alert(e);
    }
    xmload.send(null);
}

var loaded = function () {
    if (xmload.readyState == 4) {
        $("#cdaxml").val(xmload.responseText);
        //$('#transform').get(0).click()
    }
};
