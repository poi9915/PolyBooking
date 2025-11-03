package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.poizz.polybooking.R

@Composable
fun PaymentSuccessScreen(
    onBack: () -> Unit = {},
    onReturnHome: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFE9FFF8))
    ) {
        // 🔹 Header (chữ Thanh toán ở giữa)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        listOf(Color(0xFF66BB6A), Color(0xFF43A047))
                    )
                )
                .padding(vertical = 10.dp)
        ) {
            // Nút quay lại bên trái
            IconButton(
                onClick = { onBack() },
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White
                )
            }

            // Chữ ở giữa
            Text(
                text = "Thanh toán",
                fontSize = 20.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )
        }

        Spacer(modifier = Modifier.height(60.dp))

        // 🔹 Icon xác nhận
        Box(
            modifier = Modifier
                .size(140.dp)
                .align(Alignment.CenterHorizontally)
                .background(Color.White, RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            // Thay icon thật nếu có: painterResource(R.drawable.ic_success)
            // ✅ Dùng Image cho ảnh PNG/JPG
            Image(
                painter = painterResource(id = R.drawable.tich),
                contentDescription = "Success",
                modifier = Modifier.size(90.dp)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 🔹 Tiêu đề và mô tả
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp)
        ) {
            Text(
                text = "Đặt lịch thành công",
                fontSize = 20.sp,
                color = Color.Black,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Lịch đặt của bạn đã được gửi tới chủ sân.",
                fontSize = 15.sp,
                color = Color.DarkGray,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp
            )
        }

        Spacer(modifier = Modifier.height(40.dp))

        // 🔹 Nút quay về
        Button(
            onClick = { onReturnHome() },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF81C784)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .width(180.dp)
                .height(48.dp)
        ) {
            Text(
                text = "Quay về",
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PaymentSuccessScreenPreview() {
    PaymentSuccessScreen()
}
