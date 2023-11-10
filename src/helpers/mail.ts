"use strict"
import nodemailer from 'nodemailer'
import config from 'config'
import jwt from 'jsonwebtoken'
import moment from 'moment-timezone'
import { Certificate } from 'crypto'

const mail: any = config.get('nodeMail')
const timeZone: any = config.get('timeZone')
const jwt_token_secret: any = config.get('jwt_token_secret')
const option: any = {
	service: "gmail",
	host: 'smtp.gmail.com',
	port: 465,
	tls: {
		//     enable: true,
		rejectUnauthorized: false
	},
	// requireTLS: true,
	// secure: false,
	auth: {
		user: mail.mail,
		pass: mail.password,
	},
}
const transPorter = nodemailer.createTransport(option)

export const custom_mail = async (user: any, password: any) => {
	return new Promise(async (resolve, reject) => {
		try {
			const mailOptions = {
				from: mail.mail, // sender address
				to: user.email,
				subject: 'Welcome to Aizawl',
				// text: `User Name: ${user.firstName} ${user.lastName}\n Message: ${user.message}`
				html: `<html>

				<head>
					<b <style>
						<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css'>
						</style>
				</head>
				
				<body>
					<table style="background: #dadada;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr>
								<td height="40"></td>
							</tr>
						</tbody>
					</table>
					<!--header table-->
				
					<table style="background: #dadada;min-width: 320px;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr width="99%">
								<td align="center">
									<center>
										<table
											style="max-width:700px;font-family: Open Sans, sans-serif;padding: 10px 0px;margin: 0 auto;background: #fff;"
											border="0" cellpadding="0" cellspacing="0" width="99%">
											<tbody>
												<tr>
													<td style="padding: 10px 20px;border-radius: 3px 0px 0px;" height="60px"
														valign="middle" width="50%">
														<a href="[[[SITEURL]]]" target="_blank"><img class="CToWUd"
																src="https://ebook12.s3.eu-central-1.amazonaws.com/katon.png" border="0"
																height="" width="112"></a>
													</td>
													<td style="padding: 10px 20px;color: rgb(69, 69, 69);border-radius: 0px 3px 0px 0px;text-align: right;"
														height="60px" valign="middle" width="50%">
														<p style="font-size: 13px; font-weight:bold; color:#00BEE3;">Welcome to Aizawl
														</p>
													</td>
												</tr>
												<tr>
													<td colspan="2"
														style="height: 13px;box-shadow: 0 5px 5px -5px #b8b8b8;border-bottom: 1px solid #AEAEAE;">
													</td>
												</tr>
												<tr>
													<td colspan="2" style="padding: 50px;" align="left">
				
														<p></p>
														<h4 style="font-size: 16px;">Hello ${user?.name},</h4>
														<p></p>
														<p style="font-size: 12px; line-height:20px;">Welcome to Aizawl! Aizawl is crafted
															as a bundle of
															transformational experiential package designed to boost the performance and
															welfare of students
															and teachers.</p>
														<p style="font-size: 12px;">Aizawl is your full yard platform for Learning and
															Training, Engaging and
															Evolving as you are empowered to fulfilling your everyday dreams using your
															TM1 laptop.</p>
														<p style="font-size: 12px;">Your account has been created successfully. Hit the
															following URL and
															use your login details:</p>
														<p><a href="http://elibrarysmartcity.mizoram.gov.in"
																target="_blank">http://elibrarysmartcity.mizoram.gov.in</a></p>
														<p style="font-size: 12px; font-weight:bold;">Email: ${user?.email}</p>
														<p style="font-size: 12px; font-weight:bold;">Password: ${password}</p>
														<p style="font-size: 12px;"></p>
														<p style="font-size: 12px;">Thank you</p>
														<p style="font-size: 11px; color:#AEAEAE;">KA Technologies team</p>
													</td>
												</tr>
				
				
												<tr>
													<td colspan="2" height="20">
														<p style="font-size: 10px;text-align: center;color:#AEAEAE;"><img width="150px"
																class="CToWUd"
																src="https://ebook12.s3.eu-central-1.amazonaws.com/katon_patner.png"
																border="0" height="" width="60">
														</p>
													</td>
												</tr>
				
											</tbody>
										</table>
										<!--body table-->
									</center>
								</td>
							</tr>
						</tbody>
					</table>
				
					<table style="background: #dadada;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr>
								<td height="40"></td>
							</tr>
						</tbody>
					</table>
					<!--header table-->
					<!--footer table-->
				</body>
				
				</html>`
			}
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err)
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			})
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

export const contact_us_mail = async (user: any) => {
	return new Promise(async (resolve, reject) => {
		try {
			const mailOptions = {
				from: mail.mail,
				to: user.email,
				subject: 'Exhibit Contact Us',
				// text: `User Name: ${user.firstName} ${user.lastName}\n Message: ${user.message}`
				html: `<html lang="en-US">
				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}
					</style>
				</head>

				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h1
															style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
															Aizawl contact us</h1>
														<span
															style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
															Hello ${user.firstName}
															<br>
															<br>
															${user.message}
															<br>
															<br>
															Kind Regards, ${user.firstName}


														</p>

													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
											<strong>http://elibrarysmartcity.mizoram.gov.in</strong></p>
										</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>`
			}
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err)
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			})
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

export const faculty_assign_mail = async (user_email: any, data: any, date, link) => {
	return new Promise(async (resolve, reject) => {
		try {
			const mailOptions = {
				from: mail.mail,
				to: user_email.toString(),
				subject: 'Aizawl Schedule',
				html: `<html lang="en-US">
				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}
					</style>
				</head>
				
				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h2
															style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
															Aizawl Schedule Link </h2>
															<br>
															Your <span style='font-size: 18px; color: #455056; font-weight:bold;'>${data.course}</span>  is Schedule on <span style='font-size: 18px; color: #455056; font-weight:bold;'>${date}</span> from <span style='font-size: 18px; color: #455056; font-weight:bold;'>${data.start_time} to ${data.end_time}</span>
															Join the classes
															link is below: 
															<h3>${link}</h3>
														
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
														<strong>http://elibrarysmartcity.mizoram.gov.in</strong>
														</p>
				
													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>`
			}
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err)
					reject(err)
				} else {
					resolve(`Email has been sent, kindly follow the instructions`)
				}
			})
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

export const email_login_mail = async (user: any, pass: any) => {
	return new Promise(async (resolve, reject) => {
		try {
			const mailOptions = {
				from: mail.mail,
				to: user.email,
				subject: "Aizawl Login and Password",
				// text: `Hi ${user.name}
				//  \n\n You have requested new account in Exhibit.
				//  \n\n Your Login
				//  \n Email Id :  ${user.email} and
				//  \n Password is ${pass} 
				//  \n\nTimestamp: ${moment.tz(timeZone).format('DD-MM-YYYY hh:mm:ss A')}  [${timeZone}]
				//  \n\nIf you did not perform this request, you can safely ignore this email.
				//  \n\nThanks,\nThe Semicolon Solution Team`
				html: `<html lang="en-US">

				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />


					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}

						.center {

							width: 100%;
							padding: 10px 0px;

						}

						.whiteBg {
							background-color: white;

							margin: 20px;
							padding: 20px;
						}

						.tablee {
							margin-left: auto;
							margin-right: auto;
						}

						.tdd {
							text-align: center;
						}
					</style>
				</head>

				<body style="background-color: #f2f3f8;">
					<div class='center '>
						<table class="tablee">
							<tr>
								<td class="tdd">
									<div class='whiteBg'>
										<h1
											style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
											Aizawl Login and Password</h1>
										<span
											style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
											Hello ${user.name},
											<br>
											You have requested new account in Aizawl.
											<br>
											Your login credential :
											<br>
											Email Id :  ${user.email}
											<br>
											Password is ${pass} 
											<br>
											<br>
											Kind Regards, Aizawl
										</p>
									</div>
								</td>
							</tr>
						</table>


					</div>

				</body>

				</html>`
			}
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err)
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			})
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

export const email_verification_mail = async (user, authToken) => {
	return new Promise((resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: user.email, // list of receivers
				subject: 'Email Verification', // Subject line
				// text: "guui huijhd",
				// html: "<h1>guigcu8h</h1><p>gcy7gub ugh bu u7ywd 78wty7w h78tywd7</p>"
				html: `<html lang="en-US">

				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />


					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}

						.center {

							width: 100%;
							padding: 10px 0px;

						}

						.whiteBg {
							background-color: white;

							margin: 20px;
							padding: 20px;
						}

						.tablee {
							margin-left: auto;
							margin-right: auto;
						}

						.tdd {
							text-align: center;
						}
					</style>
				</head>

				<body style="background-color: #f2f3f8;">
					<div class='center '>
						<table class="tablee">
							<tr>
								<td class="tdd">
									<div class='whiteBg'>
										<h1
											style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
											Aizawl email verification</h1>
										<span
											style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
											Hello ${user.name}
											<br>
											<br>
											You registered an account on Aizawl Account, before being able to use
											your account you need to verify
											<br>
											you need to verify that this is your email address
											<br>
											<br>
											Email verification OTP : <b>${authToken}</b>
											<br>
											<br>
											Kind Regards, Aizawl
										</p>
										<strong>http://elibrarysmartcity.mizoram.gov.in</strong>
									</div>
								</td>
							</tr>
						</table>


					</div>

				</body>

				</html>`,
				// html: `<html lang="en-US">
				// <head>
				// 	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
				// 	<title>E-Book</title>
				// 	<meta name="description" content="E-Book">
				// 	<style type="text/css">
				// 		a:hover {
				// 			text-decoration: underline !important;
				// 		}
				// 	</style>
				// </head>

				// <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
				// 	<!--100% body table-->
				// 	<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
				// 		style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
				// 		<tr>
				// 			<td>
				// 				<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
				// 					align="center" cellpadding="0" cellspacing="0">
				// 					<tr>
				// 						<td style="height:80px;">&nbsp;</td>
				// 					</tr>
				// 					<tr>
				// 						<td style="height:20px;">&nbsp;</td>
				// 					</tr>
				// 					<tr>
				// 						<td>
				// 							<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
				// 								style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
				// 								<tr>
				// 									<td style="height:40px;">&nbsp;</td>
				// 								</tr>
				// 								<tr>
				// 									<td style="padding:0 35px;">
				// 										<h1
				// 											style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
				// 											E-Book email verification</h1>
				// 										<span
				// 											style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
				// 										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
				// 											Hello
				// 											<br>
				// 											<br>
				// 											You registered an account on E-Book Account, before being able to use
				// 											your account you need to verify that this is your email address
				// 											<br>
				// 											<br>
				//                                             Email verification OTP : 
				//                                             1111111
				// 											<br>
				// 											<br>
				// 											Kind Regards, E-Book


				// 										</p>

				// 									</td>
				// 								</tr>
				// 								<tr>
				// 									<td style="height:40px;">&nbsp;</td>
				// 								</tr>
				// 							</table>
				// 						</td>
				// 					<tr>
				// 						<td style="height:20px;">&nbsp;</td>
				// 					</tr>
				// 					<tr>
				// 						<td style="text-align:center;">
				// 							<strong>www.E-book.com</strong></p>
				// 						</td>
				// 					</tr>
				// 					<tr>
				// 						<td style="height:80px;">&nbsp;</td>
				// 					</tr>
				// 				</table>
				// 			</td>
				// 		</tr>
				// 	</table>
				// </body>
				// </html>`, // html body
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const forgot_password_mail = (user, otp) => {
	return new Promise(async (resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: user.email, // list of receivers
				subject: 'Forget Password Mail', // Subject line
				html: `<html lang="en-US">
				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}
					</style>
				</head>

				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h1
															style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
															Aizawl Forget Password Mail</h1>
														<span
															style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
															Hello ${user.name}
															<br>
															<br>
															Someone, hopefully you, has requested to reset the password for your
                                                            Aizawl account.
															<br>
															<br>
                                                            OTP will expire in 10 minutes.
															<br>
															Verification code: ${otp}
															<br>
															<br>
															Kind Regards, Aizawl


														</p>

													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
											<strong>http://elibrarysmartcity.mizoram.gov.in</strong></p>
										</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>`, // html body
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	})
}

export const Re_activation_mail = (user, otp) => {
	return new Promise(async (resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: user.email, // list of receivers
				subject: 'Re-activation Mail', // Subject line
				html: `<html lang="en-US">
				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}
					</style>
				</head>

				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h1
															style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
															Aizawl Re-activation Mail</h1>
														<span
															style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
															Hello ${user.name}
															<br>
															<br>
															Someone, hopefully you, has requested to Re-activation for your
                                                            Aizawl account.
															<br>
															<br>
                                                            OTP will expire in 10 minutes.
															<br>
															Verification code: ${otp}
															<br>
															<br>
															Kind Regards, Aizawl


														</p>

													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
											<strong>http://elibrarysmartcity.mizoram.gov.in</strong></p>
										</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>`, // html body
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	})
}

export const email_approved = async (email) => {
	return new Promise((resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: email, // list of receivers
				subject: 'Approve Mail', // Subject line
				html: `<html lang="en-US">
				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}
					</style>
				</head>

				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h1
															style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
															Aizawl Certificate Approved</h1>
														<span
															style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
															Hello
															<br>
															<br>
															Your Certificate is Ready.
															Please check into website
															<br>
															<br>
															<br>
															<br>
															Kind Regards, Aizawl


														</p>

													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
											<strong>http://elibrarysmartcity.mizoram.gov.in</strong></p>
										</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
				</html>`, // html body
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const welcome_mail = async (user) => {
	return new Promise((resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: user.email, // list of receivers
				subject: 'Welcome to Aizawl', // Subject line
				html: `<html>

				<head>
					<b <style>
						<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css'>
						</style>
				</head>
				
				<body>
					<table style="background: #dadada;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr>
								<td height="40"></td>
							</tr>
						</tbody>
					</table>
					<!--header table-->
				
					<table style="background: #dadada;min-width: 320px;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr width="99%">
								<td align="center">
									<center>
										<table
											style="max-width:700px;font-family: Open Sans, sans-serif;padding: 10px 0px;margin: 0 auto;background: #fff;"
											border="0" cellpadding="0" cellspacing="0" width="99%">
											<tbody>
												<tr>
													<td style="padding: 10px 20px;border-radius: 3px 0px 0px;" height="60px"
														valign="middle" width="50%">
														<a href="[[[SITEURL]]]" target="_blank"><img class="CToWUd"
																src="https://ebook12.s3.eu-central-1.amazonaws.com/katon.png" border="0"
																height="" width="112"></a>
													</td>
													<td style="padding: 10px 20px;color: rgb(69, 69, 69);border-radius: 0px 3px 0px 0px;text-align: right;"
														height="60px" valign="middle" width="50%">
														<p style="font-size: 13px; font-weight:bold; color:#00BEE3;">Welcome to Aizawl
														</p>
													</td>
												</tr>
												<tr>
													<td colspan="2"
														style="height: 13px;box-shadow: 0 5px 5px -5px #b8b8b8;border-bottom: 1px solid #AEAEAE;">
													</td>
												</tr>
												<tr>
													<td colspan="2" style="padding: 50px;" align="left">
				
														<p></p>
														<h4 style="font-size: 16px;">Hello ${user?.name},</h4>
														<p></p>
														<p style="font-size: 12px; line-height:20px;">Welcome to Aizawl! Aizawl is crafted
															as a bundle of
															transformational experiential package designed to boost the performance and
															welfare of students
															and teachers.</p>
														<p style="font-size: 12px;">Aizawl is your full yard platform for Learning and
															Training, Engaging and
															Evolving as you are empowered to fulfilling your everyday dreams using your
															TM1 laptop.</p>
														<p style="font-size: 12px;">Your account has been created successfully. Hit the
															following URL and
															use your login details:</p>
														<p><a href="http://elibrarysmartcity.mizoram.gov.in"
																target="_blank">http://elibrarysmartcity.mizoram.gov.in</a></p>
														<p style="font-size: 12px; font-weight:bold;">Email: ${user?.email}</p>
														<p style="font-size: 12px;">Password: ${user?.register_password}</p>
														<p style="font-size: 12px;">Thank you</p>
														<p style="font-size: 11px; color:#AEAEAE;">KA Technologies team</p>
													</td>
												</tr>
				
				
												<tr>
													<td colspan="2" height="20">
														<p style="font-size: 10px;text-align: center;color:#AEAEAE;"><img width="150px"
																class="CToWUd"
																src="https://ebook12.s3.eu-central-1.amazonaws.com/katon_patner.png"
																border="0" height="" width="60">
														</p>
													</td>
												</tr>
				
											</tbody>
										</table>
										<!--body table-->
									</center>
								</td>
							</tr>
						</tbody>
					</table>
				
					<table style="background: #dadada;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr>
								<td height="40"></td>
							</tr>
						</tbody>
					</table>
					<!--header table-->
					<!--footer table-->
				</body>
				
				</html>`,
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const welcome_mail_google_SL_facebook_SL = async (user) => {
	return new Promise((resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: user.email, // list of receivers
				subject: 'Welcome to Aizawl', // Subject line
				html: `<html>

				<head>
					<b <style>
						<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700' rel='stylesheet' type='text/css'>
						</style>
				</head>
				
				<body>
					<table style="background: #dadada;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr>
								<td height="40"></td>
							</tr>
						</tbody>
					</table>
					<!--header table-->
				
					<table style="background: #dadada;min-width: 320px;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr width="99%">
								<td align="center">
									<center>
										<table
											style="max-width:700px;font-family: Open Sans, sans-serif;padding: 10px 0px;margin: 0 auto;background: #fff;"
											border="0" cellpadding="0" cellspacing="0" width="99%">
											<tbody>
												<tr>
													<td style="padding: 10px 20px;border-radius: 3px 0px 0px;" height="60px"
														valign="middle" width="50%">
														<a href="[[[SITEURL]]]" target="_blank"><img class="CToWUd"
																src="https://ebook12.s3.eu-central-1.amazonaws.com/katon.png" border="0"
																height="" width="112"></a>
													</td>
													<td style="padding: 10px 20px;color: rgb(69, 69, 69);border-radius: 0px 3px 0px 0px;text-align: right;"
														height="60px" valign="middle" width="50%">
														<p style="font-size: 13px; font-weight:bold; color:#00BEE3;">Welcome to Aizawl
														</p>
													</td>
												</tr>
												<tr>
													<td colspan="2"
														style="height: 13px;box-shadow: 0 5px 5px -5px #b8b8b8;border-bottom: 1px solid #AEAEAE;">
													</td>
												</tr>
												<tr>
													<td colspan="2" style="padding: 50px;" align="left">
				
														<p></p>
														<h4 style="font-size: 16px;">Hello ${user?.name},</h4>
														<p></p>
														<p style="font-size: 12px; line-height:20px;">Welcome to Aizawl! Aizawl is crafted
															as a bundle of
															transformational experiential package designed to boost the performance and
															welfare of students
															and teachers.</p>
														<p style="font-size: 12px;">Aizawl is your full yard platform for Learning and
															Training, Engaging and
															Evolving as you are empowered to fulfilling your everyday dreams using your
															TM1 laptop.</p>
														<p style="font-size: 12px;">Your account has been created successfully. Hit the
															following URL and
															use your login details:</p>
														<p><a href="http://elibrarysmartcity.mizoram.gov.in"
																target="_blank">http://elibrarysmartcity.mizoram.gov.in</a></p>
														<p style="font-size: 12px; font-weight:bold;">Email: ${user?.email}</p>
														<p style="font-size: 12px; font-weight: bold;">Please use social connects for login</p>
														<p style="font-size: 12px;">Thank you</p>
														<p style="font-size: 11px; color:#AEAEAE;">KA Technologies team</p>
													</td>
												</tr>
				
				
												<tr>
													<td colspan="2" height="20">
														<p style="font-size: 10px;text-align: center;color:#AEAEAE;"><img width="150px"
																class="CToWUd"
																src="https://ebook12.s3.eu-central-1.amazonaws.com/katon_patner.png"
																border="0" height="" width="60">
														</p>
													</td>
												</tr>
				
											</tbody>
										</table>
										<!--body table-->
									</center>
								</td>
							</tr>
						</tbody>
					</table>
				
					<table style="background: #dadada;" border="0" cellpadding="0" cellspacing="0" width="99%">
						<tbody>
							<tr>
								<td height="40"></td>
							</tr>
						</tbody>
					</table>
					<!--header table-->
					<!--footer table-->
				</body>
				
				</html>`,
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const email_verification_mail_during_exam = async (user) => {
	return new Promise((resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: user.email, // list of receivers
				subject: 'Email Verification', // Subject line
				html: `<html lang="en-US">

				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />


					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}

						.center {

							width: 100%;
							padding: 10px 0px;

						}

						.whiteBg {
							background-color: white;

							margin: 20px;
							padding: 20px;
						}

						.tablee {
							margin-left: auto;
							margin-right: auto;
						}

						.tdd {
							text-align: center;
						}
					</style>
				</head>

				<body style="background-color: #f2f3f8;">
					<div class='center '>
						<table class="tablee">
							<tr>
								<td class="tdd">
									<div class='whiteBg'>
										<h1
											style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
											Aizawl exam verification</h1>
										<span
											style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
											Hello ${user.name}
											<br>
											<br>
											You have to verify Aizawl Account during exam.
											<br>
											<br>
											Exam verification OTP : <b>${user.otp}</b>
											<br>
											<br>
											Kind Regards, Aizawl
										</p>
										<strong>http://elibrarysmartcity.mizoram.gov.in</strong>
									</div>
								</td>
							</tr>
						</table>


					</div>

				</body>

				</html>`,
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const email_verification_mail_User = async (mail_data: any) => {
	return new Promise((resolve, reject) => {
		try {
			var mailOptions = {
				from: mail.mail, // sender address
				to: mail_data.email, // list of receivers
				subject: 'Email Verification', // Subject line
				// text: "guui huijhd",
				// html: "<h1>guigcu8h</h1><p>gcy7gub ugh bu u7ywd 78wty7w h78tywd7</p>"
				html: `<html lang="en-US">

				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />


					<title>Aizawl</title>
					<meta name="description" content="Aizawl">
					<style type="text/css">
						a:hover {
							text-decoration: underline !important;
						}

						.center {

							width: 100%;
							padding: 10px 0px;

						}

						.whiteBg {
							background-color: white;

							margin: 20px;
							padding: 20px;
						}

						.tablee {
							margin-left: auto;
							margin-right: auto;
						}

						.tdd {
							text-align: center;
						}
					</style>
				</head>

				<body style="background-color: #f2f3f8;">
					<div class='center '>
						<table class="tablee">
							<tr>
								<td class="tdd">
									<div class='whiteBg'>
										<h1
											style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
											Aizawl email verification</h1>
										<span
											style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
										<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
											Hello ${mail_data.email}
											<br>
											<br>
											You registered an account on Aizawl Account, before being able to use
											your account you need to verify
											<br>
											you need to verify that this is your email address
											<br>
											<br>
											Email verification OTP : <b>${mail_data.otp}</b>
											<br>
											<br>
											Kind Regards, Aizawl
										</p>
										<strong>http://elibrarysmartcity.mizoram.gov.in</strong>
									</div>
								</td>
							</tr>
						</table>


					</div>

				</body>

				</html>`,
			};

			// send mail with defined transport object
			transPorter.sendMail(mailOptions, function (err, data) {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(`Email has been sent to ${mail_data.email}, kindly follow the instructions`)
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};