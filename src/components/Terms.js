import React from 'react'
import { Typography, Box, Button } from '@material-ui/core'
import Link from 'next/link'

export const AllTerms = props => [
	{
		code: 'intro',
		title: 'Introduction',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					{'These terms and conditions outline the rules and regulations for the use of COVID STATS Website, located at https://covid.delalify.com/.'}
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					By accessing this website we assume you accept these terms and conditions. Do not continue to use DELALIFY if you do not agree to take all of the terms and conditions stated on this page.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					{'The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.'}
				</Typography>
			</Box>
		)
	}, {
		code: 'license',
		title: 'License',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					Unless otherwise stated, DELALIFY and/or its licensors own the intellectual property rights for all material on DELALIFY. All intellectual property rights are reserved. You may access this from DELALIFY for your own personal use subjected to restrictions set in these terms and conditions.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					You must not:
				</Typography>
				<ul>
					{
						'Republish material from DELALIFY$Sell, rent or sub-license material from DELALIFY$Reproduce, duplicate or copy material from DELALIFY$Redistribute content from DELALIFY'
							.split( '$' ).map( ( text, index ) => (
								<li key={text + index}>
									<Typography variant='body1'>{text}</Typography>
								</li>
							) )
					}
				</ul>
				<Typography variant='body1' className={props.classes.para}>
					This Agreement shall begin on the date hereof.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. DELALIFY does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of DELALIFY, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, DELALIFY shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
				</Typography>
			</Box>
		)
	}, {
		code: 'hyperlinks',
		title: 'Hyperlinking to our Content',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					The following organizations may link to our Website without prior written approval:
				</Typography>
				<ul>
					{
						'Government agencies;$Search engines;$News organizations;$Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses;$System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.'
							.split( '$' ).map( ( text, index ) => (
								<li key={text + index}>
									<Typography variant='body1'>{text}</Typography>
								</li>
							) )
					}
				</ul>
				<Typography variant='body1' className={props.classes.para}>
					These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					We may consider and approve other link requests from the following types of organizations:
				</Typography>
				<ul>
					{
						'Commonly-known consumer and/or business information sources;$dot.com community sites;$associations or other groups representing charities;$online directory distributors;$internet portals;$accounting, law and consulting firms;$educational institutions and trade associations.'
							.split( '$' ).map( ( text, index ) => (
								<li key={text + index}>
									<Typography variant='body1'>{text}</Typography>
								</li>
							) )
					}
				</ul>
				<Typography variant='body1' className={props.classes.para}>
					We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of DELALIFY; and (d) the link is in the context of general resource information.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to DELALIFY. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					Approved organizations may hyperlink to our Website as follows:
				</Typography>
				<ul>
					{
						'By use of our corporate name;$By use of the uniform resource locator being linked to;$By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.'
							.split( '$' ).map( ( text, index ) => (
								<li key={text + index}>
									<Typography variant='body1'>{text}</Typography>
								</li>
							) )
					}
				</ul>
				<Typography variant='body1' className={props.classes.para}>
					{'No use of DELALIFY logo or other artwork will be allowed for linking absent a trademark license agreement.'}
				</Typography>
			</Box>
		)
	}, {
		code: 'iframes',
		title: 'Iframes',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.
				</Typography>
			</Box>
		)
	}, {
		code: 'contentliability',
		title: 'Content liability',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
				</Typography>
			</Box>
		)
	}, {
		code: 'rights',
		title: 'Reservation of Rights',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
				</Typography>
			</Box>
		)
	}, {
		code: 'linksremoval',
		title: 'Removal of links from our website',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
				</Typography>
			</Box>
		)
	}, {
		code: 'disclaimer',
		title: 'Disclaimer',
		text: '',
		content: (
			<Box>
				<Typography variant='body1' className={props.classes.para}>
					To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
				</Typography>
				<ul>
					{
						'limit or exclude our or your liability for death or personal injury;$limit or exclude our or your liability for fraud or fraudulent misrepresentation;$limit any of our or your liabilities in any way that is not permitted under applicable law;$exclude any of our or your liabilities that may not be excluded under applicable law.'
							.split( '$' ).map( ( text, index ) => (
								<li key={text + index}>
									<Typography variant='body1'>{text}</Typography>
								</li>
							) )
					}
				</ul>
				<Typography variant='body1' className={props.classes.para}>
					The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
				</Typography>
				<Typography variant='body1' className={props.classes.para}>
					As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
				</Typography>
			</Box>
		)
	}, {
		code: 'privacy',
		title: 'Privacy policy',
		text: '',
		content: (
			<Box
				style={{
					display: 'flex',
					flexGrow: 1,
					alignItems: 'center',
					justifyContent: 'center',
					margin: '50px auto'
				}}>
				<Link href='/privacy'>
					<a>
						<Button variant='contained' size='medium' color='primary'>Learn more</Button>
					</a>
				</Link>
			</Box>
		)
	},
]