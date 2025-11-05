package com.poizz.polybooking.ui.screen.auth


import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.poizz.polybooking.R
import com.poizz.polybooking.ui.theme.PolyBookingTheme

@Composable
fun AccountScreen(
    onBackClick: () -> Unit = {},
    onEditClick: () -> Unit = {} // ← Callback khi nhấn "Cập nhật"

) {
    val scrollState = rememberScrollState()

//    var name by remember { mutableStateOf(TextFieldValue("")) }
//    var gender by remember { mutableStateOf(TextFieldValue("")) }
//    var birthDate by remember { mutableStateOf(TextFieldValue("")) }
//    var level by remember { mutableStateOf(TextFieldValue("")) }
//    var phone by remember { mutableStateOf(TextFieldValue("")) }
//    var email by remember { mutableStateOf(TextFieldValue("")) }
//    var address by remember { mutableStateOf(TextFieldValue("")) }
    // Dữ liệu mẫu — hoặc lấy từ ViewModel / Supabase
    val name = "Nguyễn Văn A"
    val gender = "Nam"
    val birthDate = "12/03/2001"
    val level = "Đại học"
    val phone = "0123 456 789"
    val email = "nguyenvana@gmail.com"
    val address = "123 Lê Lợi, TP. Hồ Chí Minh"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFDFFFC8)) // 💡 nền sáng hơn một chút
            .verticalScroll(scrollState)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF4CAF50)),

            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                painter = painterResource(id = R.drawable.baseline_arrow_back_24),
                contentDescription = "Back",
                tint = Color.White,
                modifier = Modifier
                    .size(28.dp)
                    .clickable { onBackClick() }
            )

            Text(
                text = "Quản lý tài khoản",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .fillMaxWidth()

                    .padding(vertical = 8.dp),
                textAlign = TextAlign.Center
            )
        }

        // Avatar
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                contentAlignment = Alignment.BottomEnd
            ) {
                Image(
                    painter = painterResource(id = R.drawable.ic_setting_profile),
                    contentDescription = "Avatar",
                    modifier = Modifier
                        .size(110.dp)
                        .clip(CircleShape)
                        .border(3.dp, Color(0xFF8BC34A), CircleShape)
                        .shadow(6.dp, CircleShape)
                )
//                Icon(
//                    painter = painterResource(id = R.drawable.baseline_edit_24),
//                    contentDescription = "Edit",
//                    tint = Color(0xFF4CAF50),
//                    modifier = Modifier
//                        .size(26.dp)
//                        .offset(x = (-4).dp, y = (-4).dp)
//                        .background(Color.White, CircleShape)
//                        .padding(4.dp)
//                )
            }
        }

        Spacer(Modifier.height(24.dp))

        // --- Thông tin cá nhân ---
        // --- Thông tin cá nhân ---
        InfoDisplaySection(
            title = "Thông tin cá nhân",
            info = listOf(
                "Họ tên" to name,
                "Giới tính" to gender,
                "Ngày sinh" to birthDate,
                "Trình độ" to level
            )
        )

        Spacer(Modifier.height(16.dp))

        // --- Thông tin liên hệ ---
        InfoDisplaySection(
            title = "Thông tin liên hệ",
            info = listOf(
                "Số điện thoại" to phone,
                "Email" to email,
                "Địa chỉ" to address
            )
        )

        Spacer(Modifier.height(32.dp))
        Button(
            onClick = { onEditClick() },
            colors = ButtonDefaults.buttonColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.5.dp, Color(0xFFF44336)),
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .padding(horizontal = 60.dp)
                .height(48.dp)
        ) {
            Text(
                text = "Cập nhật",
                color = Color(0xFFF44336),
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        }

    }
}

@Composable
fun InfoDisplaySection(
    title: String,
    info: List<Pair<String, String>>
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .background(Color.White, RoundedCornerShape(12.dp))
            .shadow(3.dp, RoundedCornerShape(12.dp))
            .padding(16.dp)
    ) {
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4CAF50),
            fontSize = 16.sp,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        info.forEach { (label, value) ->
            Column(modifier = Modifier.padding(vertical = 6.dp)) {
                Text(
                    text = label,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
                Text(
                    text = value,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.Black,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF3F6FA), RoundedCornerShape(8.dp))
                        .padding(horizontal = 12.dp, vertical = 10.dp)
                )
            }
        }
    }
}

    @Preview(showBackground = true)
    @Composable
    fun PreviewAccountScreen() {
        PolyBookingTheme {
            AccountScreen()
        }
    }

