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
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
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
    onSignUpSuccess: () -> Unit = {},
    onBackToLogin: () -> Unit = {}
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
                text = "ĐĂNG KÝ",
                color = MaterialTheme.colorScheme.primary,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Ô nhập Email
            OutlinedTextField(
                leadingIcon = {
                    Icon(Icons.Default.Email, contentDescription = "Email")
                },
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
                leadingIcon = {
                    Icon(Icons.Default.Lock, contentDescription = "Password")
                },
                value = password,
                onValueChange = { password = it },
                label = { Text("Mật khẩu") },
                placeholder = { Text("Nhập mật khẩu") },
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
                leadingIcon = {
                    Icon(Icons.Default.Lock, contentDescription = "Password")
                },
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Nhập lại mật khẩu") },
                placeholder = { Text("Nhập lại mật khẩu") },
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

            // Nút đăng ký
            OutlinedButton(
                onClick = {
                    // Giả lập đăng nhập thành công
                    if (email.isNotBlank() && password.isNotBlank()) {
                        onSignUpSuccess()  // chuyển sang login
                    } else {
                        // bạn có thể thêm Toast hoặc Snackbar báo lỗi ở đây
                    }
                },
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Đăng ký")
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Dòng Login
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Bạn đã có tài khoản ? ",
                    color = Color.Black,
                    style = TextStyle(fontSize = 16.sp)
                )
                Text(
                    text = "Đăng nhập",
                    color = Color(0xFF4F8A10),
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { onBackToLogin?.invoke() }
                )
            }
        }
    }
}

//@Preview(showBackground = true)
//@Composable
//fun PreviewSignUp() {
//    PolyBookingTheme {
//        SignUpScreen()
//    }
//}
