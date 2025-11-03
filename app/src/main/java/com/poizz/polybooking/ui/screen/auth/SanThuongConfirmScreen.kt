package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun BookingConfirmScreen(
    onBack: () -> Unit = {},
    onConfirm: (String, String, String) -> Unit = { _, _, _ -> }
) {
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var note by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFFE8F5E9), Color(0xFFE9FFF8)) // xanh pastel + vàng nhạt
                )
            )
            .padding(bottom = 16.dp)
    ) {
        // 🔹 Thanh tiêu đề hiện đại
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp)
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF66BB6A), Color(0xFF43A047))
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            IconButton(onClick = { onBack() }, modifier = Modifier.align(Alignment.CenterStart)) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
            Text(
                text = "Xác nhận đặt sân",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 🔸 Thông tin sân
        InfoCard(
            title = "📍 Thông tin sân",
            content = "Tên sân: Sân A\nĐịa chỉ: Khu thể thao FPoly\nGiá sân: 150.000đ/giờ",
            color = Color(0xFFB3E5FC) // pastel xanh lá nhạt
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 🔸 Thông tin lịch đặt
        InfoCard(
            title = "🕒 Thông tin lịch đặt",
            content = "Ngày: 21/10/2025\nTừ giờ: 7:00\nĐến giờ: 9:00\nTổng tiền: 300.000đ",
            color = Color(0xFFE2B6FA) // pastel vàng nhạt
        )

        Spacer(modifier = Modifier.height(18.dp))

        // 🔸 Form nhập thông tin
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
        ) {
            Text(
                "Thông tin người đặt",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Color(0xFF2E7D32)
            )
            Spacer(modifier = Modifier.height(10.dp))

            InputField(label = "Tên của bạn", value = name, onValueChange = { name = it })
            InputField(label = "Số điện thoại", value = phone, onValueChange = { phone = it })
            InputField(label = "Ghi chú cho chủ sân", value = note, onValueChange = { note = it })
        }

        Spacer(modifier = Modifier.height(28.dp))

        // 🔹 Nút xác nhận thanh toán
        Button(
            onClick = { onConfirm(name, phone, note) },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF81C784)),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .padding(horizontal = 40.dp)
        ) {
            Text(
                text = "Xác nhận & Thanh toán",
                color = Color.White,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun InfoCard(title: String, content: String, color: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .shadow(3.dp, RoundedCornerShape(16.dp))
            .background(color.copy(alpha = 0.8f), RoundedCornerShape(16.dp))
            .border(1.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Column {
            Text(
                title,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Color(0xFF4A148C)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                content,
                fontSize = 14.sp,
                color = Color(0xFF424242),
                lineHeight = 20.sp
            )
        }
    }
}

@Composable
fun InputField(label: String, value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        singleLine = true,
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Color(0xFF81C784),
            focusedLabelColor = Color(0xFF388E3C),
            unfocusedBorderColor = Color(0xFFBDBDBD)
        )
    )
}

@Preview(showBackground = true)
@Composable
fun PreviewBookingConfirmScreen() {
    BookingConfirmScreen()
}
