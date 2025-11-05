package com.poizz.polybooking.ui.screen.auth



import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.poizz.polybooking.R
import com.poizz.polybooking.ui.theme.PolyBookingTheme

@Composable
fun SettingScreen(
    onBackClick: () -> Unit = {}
) {
    var notificationEnabled by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)

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
                text = "Cài đặt",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .fillMaxWidth()

                    .padding(vertical = 8.dp),
                textAlign = TextAlign.Center
            )
        }

        Spacer(Modifier.height(12.dp))

        // --- Cài đặt chung ---
        SettingSection(title = "Cài đặt chung") {
            SettingToggleItem(
                title = "Thông báo hệ thống",
                checked = notificationEnabled,
                onCheckedChange = { notificationEnabled = it }
            )

            SettingTextButton(title = "Ngôn ngữ", value = "Tiếng Việt")
        }

        Spacer(Modifier.height(16.dp))

        // --- Cài đặt tài khoản ---
        SettingSection(title = "Cài đặt Tài khoản") {
            SettingIconButton(title = "Liên kết với Zalo", iconRes = R.drawable.img_zalo)
            SettingIconButton(title = "Liên kết với Facebook", iconRes = R.drawable.img_fb)
            SettingIconButton(title = "Liên kết với Google", iconRes = R.drawable.img_google)
            SettingTextButton(title = "Đổi mật khẩu")
        }

        Spacer(Modifier.height(24.dp))

        // --- Xóa tài khoản ---
        Text(
            text = "Xóa Tài khoản",
            color = Color.Red,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            modifier = Modifier
                .fillMaxWidth()
                .clickable { /* TODO: Xóa tài khoản */ }
        )
    }
}

@Composable
fun SettingSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(12.dp)
    ) {
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color.Black,
            modifier = Modifier.padding(bottom = 8.dp)
        )
        content()
    }
}

@Composable
fun SettingToggleItem(
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp)
            .border(1.dp, Color(0xFF8CD790), RoundedCornerShape(8.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 15.sp,
            modifier = Modifier.weight(1f)
        )
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF8CD790)
            )
        )
    }
}

@Composable
fun SettingTextButton(title: String, value: String? = null) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp)
            .border(1.dp, Color(0xFF8CD790), RoundedCornerShape(8.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 15.sp,
            modifier = Modifier.weight(1f)
        )
        if (value != null) {
            Text(
                text = value,
                fontSize = 15.sp,
                color = Color.DarkGray
            )
        }
    }
}

@Composable
fun SettingIconButton(title: String, iconRes: Int) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp)
            .border(1.dp, Color(0xFF8CD790), RoundedCornerShape(8.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 15.sp,
            modifier = Modifier.weight(1f)
        )
        Image(
            painter = painterResource(id = iconRes),
            contentDescription = title,
            modifier = Modifier.size(40.dp),
            contentScale = ContentScale.Fit
        )
    }
}
@Preview(showBackground = true)
@Composable
fun PreviewSettingScreen() {
    PolyBookingTheme {
        SettingScreen()
    }
}
