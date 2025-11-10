package com.poizz.polybooking.ui.screen.auth


import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Password
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalInspectionMode
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.poizz.polybooking.BuildConfig
import com.poizz.polybooking.R
import com.poizz.polybooking.data.models.Profile
import com.poizz.polybooking.data.remote.SupabaseClientInstance
import com.poizz.polybooking.properties.SupabaseEnum
import com.poizz.polybooking.ui.theme.PolyBookingPreviewTheme
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.Google
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.auth.providers.builtin.IDToken
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.launch
import java.security.MessageDigest
import java.util.UUID

@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
@Composable
fun LoginScreen(
    supabase: SupabaseClientInstance = SupabaseClientInstance,
    onLoginSuccess: () -> Unit,
    onNavigateToSignup: () -> Unit,
) {

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var isError by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val isPreview = LocalInspectionMode.current

    ElevatedCard(
        modifier = Modifier.padding(20.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            Image(
                painter = painterResource(id = R.drawable.b051d8a5bd3d78d8ec2),
                contentDescription = "Logo icon",
                modifier = Modifier.size(200.dp)
            )
            Text(
                text = "Đăng nhập",
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.headlineMedium
            )
            OutlinedTextField(
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Email, contentDescription = "Icon Email"
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") })
            OutlinedTextField(
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Password, contentDescription = "Icon password"
                    )
                },
                trailingIcon = {
                    val image = if (passwordVisible) Icons.Default.Visibility
                    else Icons.Default.VisibilityOff

                    IconButton(onClick = {
                        passwordVisible = !passwordVisible
                    }) {
                        Icon(
                            imageVector = image, "Toggle password Visibility"
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                value = password,
                onValueChange = {
                    password = it
                },
                label = { Text("Password") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation()
            )

            OutlinedButton(
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                ),
                onClick = {
                    scope.launch {
                        isLoading = true
                        try {
                            supabase.client.auth.signInWith(Email) {
                                this.email = email
                                this.password = password
                            }
                            onLoginSuccess()
                        } catch (e: Exception) {
                            if (!isPreview) {
                                Toast.makeText(context, "Đăng nhập thất bại!", Toast.LENGTH_SHORT).show()
                            }
                        } finally {
                            isLoading = false
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            color = MaterialTheme.colorScheme.onPrimary,
                            strokeWidth = 2.dp,
                            modifier = Modifier
                                .size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Đang đăng nhập...",
                            style = MaterialTheme.typography.labelLarge
                        )
                    } else {
                        Text(
                            text = "Đăng nhập",
                            style = MaterialTheme.typography.labelLarge
                        )
                    }
                }
            }

            TextButton(onClick = onNavigateToSignup) {
                Text(
                    text = "Chưa có tài khoản ? , Đăng ký ngay !!!",
                    color = MaterialTheme.colorScheme.primary,
                    style = MaterialTheme.typography.bodySmall,
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                HorizontalDivider(
                    modifier = Modifier.weight(1f), color = Color.Black, thickness = 1.dp
                )
                Text(
                    text = "Hoặc",
                    modifier = Modifier.padding(horizontal = 8.dp),
                    style = MaterialTheme.typography.bodySmall,
                )
                HorizontalDivider(
                    modifier = Modifier.weight(1f), color = Color.Black, thickness = 1.dp
                )
            }
            ElevatedButton(
                onClick = {
                    val credentialManager = CredentialManager.create(context)

                    val rawNonce = UUID.randomUUID().toString()
                    val bytes = rawNonce.toByteArray()
                    val md = MessageDigest.getInstance("SHA-256")
                    val digest = md.digest(bytes)
                    val hashedNonce = digest.fold("") { str, it ->
                        str + "%02x".format(it)
                    }
                    val googleIdOption: GetGoogleIdOption =
                        GetGoogleIdOption.Builder().setFilterByAuthorizedAccounts(false)
                            .setServerClientId(BuildConfig.WEB_CLIENT_ID).setNonce(hashedNonce)
                            .build()
                    val request: GetCredentialRequest =
                        GetCredentialRequest.Builder().addCredentialOption(googleIdOption).build()
                    scope.launch {
                        try {
                            isLoading = true

                            val result = credentialManager.getCredential(
                                request = request, context = context
                            )
                            val credential = result.credential
                            val googleIdTokenCredential =
                                GoogleIdTokenCredential.createFrom(credential.data)
                            val googleIdToken = googleIdTokenCredential.idToken
                            val googleName = googleIdTokenCredential.displayName

                            supabase.client.auth.signInWith(IDToken) {
                                idToken = googleIdToken
                                provider = Google
                                nonce = rawNonce
                            }
                            val user = supabase.client.auth.currentUserOrNull()
                            if (user != null) {
                                val displayName = googleIdTokenCredential.displayName
                                val email = user.email
                                val avatarUrl = googleIdTokenCredential.profilePictureUri.toString()
                                try {
                                    val existingProfile =
                                        supabase.client.from(SupabaseEnum.SUPABASE_TABLE_PROFILES.value)
                                            .select {
                                                filter { eq("id", user.id) }
                                            }
                                            .decodeList<Profile>()
                                    if (existingProfile.isEmpty()) {
                                        //Check user đã tồn tại chưa , chưa có thì khi login bằng Credential thì add vào table profile
                                        val newProfile = Profile(
                                            id = user.id,
                                            username = displayName ?: "",
                                            email = email ?:"",
                                            avatar_url = avatarUrl
                                        )
                                        supabase.client.from(SupabaseEnum.SUPABASE_TABLE_PROFILES.value).insert(newProfile)
                                        Log.d("LOGDB", "LoginScreen: ADD provider user thành công")
                                    }else{
                                        Log.d("LOGDB", "LoginScreen: Đã có profile ")
                                    }

                                } catch (e: Exception) {
                                    Toast.makeText(
                                        context,
                                        "Lấy User Data thất bại ",
                                        Toast.LENGTH_LONG
                                    ).show()
                                }
                            }

                            onLoginSuccess()


                        } catch (e: GetCredentialCancellationException) {

                        } catch (e: GetCredentialException) {
                            Toast.makeText(context, "Đăng nhập thất bại", Toast.LENGTH_LONG).show()
                        } finally {
                            isLoading = false
                        }

                    }
                },
                colors = ButtonDefaults.elevatedButtonColors(
                    containerColor = Color.LightGray,
                    contentColor = Color.Black,
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 32.dp, vertical = 8.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.google_icon_logo_svgrepo_com),
                        contentDescription = "Google Icon",
                        tint = Color.Unspecified,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(Modifier.width(16.dp))

                    Text(
                        text = "Đăng nhập bằng Google", style = MaterialTheme.typography.labelLarge
                    )
                }
            }
        }
    }
}
