package com.poizz.polybooking.ui.screen.auth

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.password
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.poizz.polybooking.data.models.Profile
import com.poizz.polybooking.ui.theme.PolyBookingPreviewTheme
import com.poizz.polybooking.data.remote.SupabaseClientInstance
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.exceptions.RestException
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.storage.storage
import kotlinx.coroutines.launch

@Composable
fun SignupScreen(
    supabase: SupabaseClientInstance,
    onSignupSuccess: () -> Unit,
    onNavigateBackToLogin: () -> Unit,
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    ElevatedCard(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // 1. Tiêu đề "Tạo tài khoản"
            Text(
                text = "Tạo tài khoản bằng Email",
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.headlineMedium,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // 2. Box nhập Tên
            OutlinedTextField(
                modifier = Modifier.fillMaxWidth(),
                value = name,
                onValueChange = { name = it },
                label = { Text("Họ và tên") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = "Icon Name"
                    )
                },
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Box nhập Email
            OutlinedTextField(
                modifier = Modifier.fillMaxWidth(),
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Email,
                        contentDescription = "Icon Email"
                    )
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Box nhập mật khẩu
            OutlinedTextField(
                modifier = Modifier.fillMaxWidth(),
                value = password,
                onValueChange = { password = it },
                label = { Text("Mật khẩu") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Icon Password"
                    )
                },
                trailingIcon = {
                    val image =
                        if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(imageVector = image, contentDescription = "Toggle password visibility")
                    }
                },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            // 3. Box xác nhận mật khẩu
            OutlinedTextField(
                modifier = Modifier.fillMaxWidth(),
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Xác nhận mật khẩu") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Icon Confirm Password"
                    )
                },
                trailingIcon = {
                    val image =
                        if (confirmPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff
                    IconButton(onClick = { confirmPasswordVisible = !confirmPasswordVisible }) {
                        Icon(imageVector = image, contentDescription = "Toggle password visibility")
                    }
                },
                visualTransformation = if (confirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                singleLine = true,
                isError = password != confirmPassword
            )
            if (password != confirmPassword && confirmPassword.isNotEmpty()) {
                Text(
                    text = "Mật khẩu không khớp",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.align(Alignment.Start)
                )
            }


            Spacer(modifier = Modifier.height(24.dp))

            // Nút đăng ký
            Button(
                modifier = Modifier.fillMaxWidth(),
                enabled = password == confirmPassword && email.isNotBlank() && password.isNotBlank() && name.isNotBlank() && !isLoading,
                onClick = {
                    scope.launch {
                        isLoading = true
                        try {
                            val session = supabase.client.auth.signUpWith(Email) {
                                this.email = email
                                this.password = password
                                // Thêm 'name' vào metadata nếu cần
                            }
                            val userId = session?.id
                            if (userId != null) {
                                val defaultAvatar = "avatar/defaultUser.svg"
                                val newProfile = Profile(
                                    id = userId,
                                    username = name,
                                    email = email,
                                    avatar_url = defaultAvatar
                                )
                                supabase.client.postgrest.from("profiles").insert(newProfile)
                                Toast.makeText(context, "Đăng ký thành công!!!", Toast.LENGTH_SHORT)
                                    .show()
                                onSignupSuccess()
                            } else {
                                Toast.makeText(context, "Đăng ký thất bại!!!", Toast.LENGTH_SHORT)
                                    .show()
                            }
                        } catch (e: Exception) {
                            Toast.makeText(context, "Lỗi: ${e.message}", Toast.LENGTH_LONG).show()
                        } catch (e: RestException) {
                            if (e.message?.contains(
                                    "User already registered",
                                    ignoreCase = true
                                ) == true
                            ) {
                                Toast.makeText(
                                    context,
                                    "Email này đã được sử dụng. Vui lòng chọn email khác.",
                                    Toast.LENGTH_LONG
                                ).show()
                            } else {
                                // Các lỗi RestException khác (vd: mật khẩu quá yếu)
                                Toast.makeText(context, "Lỗi: ${e.message}", Toast.LENGTH_LONG)
                                    .show()
                            }
                        } finally {
                            isLoading = false
                        }
                    }
                }
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text("Đăng ký")
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Nút quay lại màn hình đăng nhập
            TextButton(onClick = onNavigateBackToLogin) {
                Text("Đã có tài khoản? Đăng nhập")
            }
        }
    }
}

// --- Preview Function ---
@Preview(showBackground = true, name = "Signup Screen Preview")
@Composable
fun SignupScreenPreview() {
    PolyBookingPreviewTheme {
        // Cung cấp các giá trị giả để Preview hoạt động
        SignupScreen(
            supabase = TODO(), // TODO() vẫn ổn cho preview nếu logic được xử lý như trên
            onSignupSuccess = { },
            onNavigateBackToLogin = { }
        )
    }
}
