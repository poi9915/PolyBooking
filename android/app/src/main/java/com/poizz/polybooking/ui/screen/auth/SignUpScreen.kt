package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.scrollable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.poizz.polybooking.R
import com.poizz.polybooking.ui.theme.PolyBookingTheme

@Composable
fun SignUpScreen(
    onLoginClick: (() -> Unit)? = null,
    onBackClick: (() -> Unit)? = null
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmVisible by remember { mutableStateOf(false) }

    // Màu nền xanh lá nhạt
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFDFFFC8)) // xanh pastel
            .padding(24.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top,
            modifier = Modifier.fillMaxSize()
        ) {
            // Nút back
            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
//                IconButton(onClick = { onBackClick?.invoke() }) {
//                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.Black)
//                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Logo
            Image(
                painter = painterResource(id = R.drawable.logo_polybooking), // 👈 thay bằng tên logo bạn thêm trong drawable
                contentDescription = "Logo",
                modifier = Modifier
                    .padding(top = 16.dp)
                    .clip(CircleShape)
                    .size(200.dp)

            )

            Spacer(modifier = Modifier.height(8.dp))

            // Tiêu đề "Sign Up"
            Text(
                text = "Sign Up",
                style = TextStyle(
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF4F8A10)
                )
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Ô nhập Email
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                placeholder = { Text("Enter email") },
                modifier = Modifier
                    .fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF9CCC65),
                    unfocusedBorderColor = Color(0xFF9CCC65),
                    focusedLabelColor = Color(0xFF4F8A10)
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Ô nhập Password
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                placeholder = { Text("Enter password") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                trailingIcon = {
                    val image = if (passwordVisible)
                        Icons.Default.Visibility
                    else
                        Icons.Default.VisibilityOff
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(imageVector = image, contentDescription = "Toggle Password Visibility")
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF9CCC65),
                    unfocusedBorderColor = Color(0xFF9CCC65),
                    focusedLabelColor = Color(0xFF4F8A10)
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Ô nhập Confirm Password
            OutlinedTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Confirm password") },
                placeholder = { Text("Enter password") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                trailingIcon = {
                    val image = if (confirmVisible)
                        Icons.Default.Visibility
                    else
                        Icons.Default.VisibilityOff
                    IconButton(onClick = { confirmVisible = !confirmVisible }) {
                        Icon(imageVector = image, contentDescription = "Toggle Confirm Password Visibility")
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                visualTransformation = if (confirmVisible) VisualTransformation.None else PasswordVisualTransformation(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF9CCC65),
                    unfocusedBorderColor = Color(0xFF9CCC65),
                    focusedLabelColor = Color(0xFF4F8A10)
                )
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Nút Sign Up
            Button(
                onClick = { /* TODO: Xử lý đăng ký */ },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8BC34A)),
                shape = RoundedCornerShape(50),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(
                    text = "Sign Up",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Dòng Login
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Already have an account? ",
                    color = Color.Black,
                    style = TextStyle(fontSize = 14.sp)
                )
                Text(
                    text = "Login",
                    color = Color(0xFF4F8A10),
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { onLoginClick?.invoke() }
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewSignUp() {
    PolyBookingTheme {
        SignUpScreen()
    }
}
