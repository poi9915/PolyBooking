package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PaymentScreen(
    onBack: () -> Unit = {},
    onUploadImage: () -> Unit = {},
    onConfirm: () -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFE9FFF8)) // nền trắng ngọc nhạt
    ) {
        // 🔹 Thanh tiêu đề
        // 🔹 Header có chữ "Xác nhận thanh toán" ở giữa
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF4CAF50))
                .padding(vertical = 14.dp, horizontal = 12.dp)
        ) {
            // Nút quay lại bên trái
            IconButton(
                onClick = { onBack() },
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = Color.White
                )
            }

            // Tiêu đề ở giữa
            Text(
                text = "Xác nhận thanh toán",
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Center)
            )
        }


        Spacer(modifier = Modifier.height(24.dp))

        // 🔹 Nội dung chính
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
        ) {
            InfoBox(
                title = "📅 Thông tin đặt sân",
                content = listOf(
                    "Tên sân: Sân A - Cỏ nhân tạo",
                    "SĐT: 0987 654 321",
                    "Ngày đặt: 21/10/2025",
                    "Giờ: 07:00 - 09:00",
                    "Tổng tiền: 300.000đ"
                )
            )

            Spacer(modifier = Modifier.height(18.dp))

            BankInfoBox()

            Spacer(modifier = Modifier.height(18.dp))

            UploadProofBox(onUpload = onUploadImage)

            Spacer(modifier = Modifier.height(30.dp))

            // 🔹 Nút xác nhận thanh toán
            Button(
                onClick = { onConfirm() },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50)),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Text(
                    text = "Xác nhận thanh toán",
                    color = Color.White,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}

// 🟩 Box thông tin đặt sân
@Composable
fun InfoBox(title: String, content: List<String>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(3.dp, RoundedCornerShape(12.dp))
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(16.dp)
    ) {
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color(0xFF2E7D32)
        )
        Spacer(modifier = Modifier.height(8.dp))
        content.forEach {
            Text(
                text = it,
                fontSize = 14.sp,
                color = Color(0xFF424242),
                lineHeight = 20.sp
            )
        }
    }
}

// 🏦 Box tài khoản ngân hàng
@Composable
fun BankInfoBox() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(3.dp, RoundedCornerShape(12.dp))
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(16.dp)
    ) {
        Text(
            text = "🏦 Tài khoản ngân hàng",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color(0xFF1B5E20)
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text("Tên TK: Nguyễn Văn A", fontSize = 14.sp, color = Color.Black)
                Text("Số TK: 1234 5678 910", fontSize = 14.sp, color = Color.Black)
                Text("Ngân hàng: Vietcombank", fontSize = 14.sp, color = Color.Black)
            }

            // QR Code placeholder
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .background(Color(0xFFF1F8E9), RoundedCornerShape(10.dp))
                    .border(1.dp, Color.Gray.copy(alpha = 0.3f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text("QR", color = Color.Gray, fontWeight = FontWeight.Bold)
            }
        }
    }
}

// 🖼️ Upload ảnh xác nhận thanh toán
@Composable
fun UploadProofBox(onUpload: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(3.dp, RoundedCornerShape(12.dp))
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(vertical = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(160.dp)
                .background(Color(0xFFF5F5F5), RoundedCornerShape(12.dp))
                .border(1.dp, Color.Gray.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
                .clickable { onUpload() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Upload",
                tint = Color.Gray,
                modifier = Modifier.size(45.dp)
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "Tải lên ảnh xác nhận thanh toán",
            fontSize = 15.sp,
            color = Color.Black,
            fontWeight = FontWeight.Medium,
            letterSpacing = 0.5.sp,
            textAlign = TextAlign.Center
        )
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewPaymentScreen() {
    PaymentScreen()
}
