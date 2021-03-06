import React from "react";
import {
	SafeAreaView,
	TextInput,
	ActivityIndicator,
	Text,
	View,
	Image,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";

import styles from "../styles/globalStyles";
import { Formik } from "formik";
import * as yup from "yup";
import Button from "../components/button";
import AsyncStorage from "@react-native-community/async-storage";

export default function Login(props) {
	const validationSchema = yup.object().shape({
		email: yup.string().label("Email").email().required(),
		password: yup
			.string()
			.label("Password")
			.required()
			.min(5, "Seems a bit short..."),
	});

	const url = "http://159.203.16.113:3000/users/authenticate";

	async function authenticate(info) {
		try {
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(info),
			}).then((response) => response.json()); //response will be a json object (that has a token)
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<SafeAreaView style={styles.container}>
				<Image
					source={require("../assets/background.jpg")}
					style={styles.backgroundImage}
				/>
				<View style={styles.formContainer}>
					<Text style={styles.formTitle}>Login</Text>
					<Formik
						initialValues={{ email: "", password: "" }}
						onSubmit={(values, actions) => {
							setTimeout(() => {
								actions.setSubmitting(false);
							}, 1000);
						}}
						validationSchema={validationSchema} //validate input information based upon above schema
					>
						{(formikProps) => (
							<React.Fragment>
								<View
									style={{
										...styles.formComponent,
										...styles.loginCenterContainer,
									}}
								>
									<Text style={styles.formText}>Email</Text>
									<TextInput
										placeholder="johndoe@example.com"
										placeholderTextColor="#AAAAAA"
										style={styles.formTextbox}
										onChangeText={formikProps.handleChange("email")} //
										onBlur={formikProps.handleBlur("email")}
										value={formikProps.values.email.toLowerCase()}
									/>
									<Text style={{ color: "red" }}>
										{formikProps.touched.email && formikProps.errors.email}
									</Text>
								</View>

								<View
									style={{
										...styles.formComponent,
										...styles.loginCenterContainer,
									}}
								>
									<Text style={styles.formText}>Password</Text>
									<TextInput
										placeholder="Password"
										placeholderTextColor="#AAAAAA"
										style={styles.formTextbox}
										onChangeText={formikProps.handleChange("password")}
										onBlur={formikProps.handleBlur("password")}
										secureTextEntry
										value={formikProps.values.password}
									/>
									<Text style={{ color: "red" }}>
										{formikProps.touched.password &&
											formikProps.errors.password}
									</Text>
								</View>

								<View
									style={{
										...styles.formComponent,
										...styles.loginCenterContainer,
									}}
								></View>
								{formikProps.isSubmitting ? (
									<ActivityIndicator />
								) : (
									<Button
										text="Submit"
										onPress={() => {
											try {
												authenticate(formikProps.values).then((response) => {
													//response is an object that has the jwt token
													Keyboard.dismiss();
													if (response.jwt) {
														console.log(response.jwt);
														AsyncStorage.setItem("Token", response.jwt)
															.then(() => {
																alert("You are logged in!");
																props.navigation.navigate("Organizations");
															})
															.catch((err) => {
																console.log(err);
															});
													} else if (response.error) {
														alert(response.error);
													} else {
														alert("Unknown Error");
													}
												});
											} catch (err) {
												console.log(err);
											}
										}}
									/>
								)}
							</React.Fragment>
						)}
					</Formik>
				</View>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
