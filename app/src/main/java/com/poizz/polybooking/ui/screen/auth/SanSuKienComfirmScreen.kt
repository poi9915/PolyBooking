package com.example.sukienbooking.ui

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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SanSuKienComfirmScreen(
    onBackClick: () -> Unit = {}
) {
    var soLuongVe by remember { mutableStateOf(1) }
    var tenNguoiDat by remember { mutableStateOf("") }
    var soDienThoai by remember { mutableStateOf("") }
    var ghiChu by remember { mutableStateOf("") }
    val giaVe = 100_000
    val tongTien = soLuongVe * giaVe

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFFE8F5E9), Color(0xFFE9FFF8))))
    ) {
        // 🔹 Thanh tiêu đề (AppBar đẹp & hiện đại)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(58.dp)
                .background(
                    Brush.horizontalGradient(
                        listOf(Color(0xFF66BB6A), Color(0xFF43A047))
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            IconButton(
                onClick = onBackClick,
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Quay lại",
                    tint = Color.White
                )
            }
            Text(
                text = "Xác nhận đặt sân",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 🔸 Thông tin sân
        InfoCard(
            title = "📍 Thông tin sân",
            lines = listOf(
                "Tên CLB: CLB Bóng đá Hòa Bình",
                "Địa chỉ: 123 Trần Phú, Hà Nội",
                "SĐT: 0987 654 321"
            ),
            color = Color(0xFFB3E5FC)
        )

        Spacer(modifier = Modifier.height(10.dp))

        // 🔸 Thông tin sự kiện
        InfoCard(
            title = "🎉 Thông tin sự kiện",
            lines = listOf(
                "Tên sự kiện: Giải bóng mini Hè 2025",
                "Ngày: 21/10/2025",
                "Giờ: 07:00 - 09:00",
                "Giá vé: 100.000đ / vé",
                "Còn lại: 25 vé"
            ),
            color = Color(0xFFE2B6FA)
        )

        Spacer(modifier = Modifier.height(14.dp))

        // 🔸 Chọn số lượng vé
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .background(Color.White, RoundedCornerShape(12.dp))
                .border(1.dp, Color(0xFFE0E0E0), RoundedCornerShape(12.dp))
                .padding(16.dp)
        ) {
            Column {
                Text(
                    "🎫 Số lượng vé cần đặt",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = Color(0xFF4A148C)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Button(
                            onClick = { if (soLuongVe > 1) soLuongVe-- },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF81C784))
                        ) {
                            Text("-", fontSize = 18.sp)
                        }
                        Text(
                            text = soLuongVe.toString(),
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 20.dp)
                        )
                        Button(
                            onClick = { soLuongVe++ },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF81C784))
                        ) {
                            Text("+", fontSize = 18.sp)
                        }
                    }
                    Text(
                        "Tổng: %,dđ".format(tongTien),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color(0xFF1B5E20)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 🔸 Nhập thông tin người đặt
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            OutlinedTextField(
                value = tenNguoiDat,
                onValueChange = { tenNguoiDat = it },
                label = { Text("Tên người đặt") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = soDienThoai,
                onValueChange = { soDienThoai = it },
                label = { Text("Số điện thoại") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = ghiChu,
                onValueChange = { ghiChu = it },
                label = { Text("Ghi chú cho chủ sân (nếu có)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            )
        }

        Spacer(modifier = Modifier.height(26.dp))

        // 🔹 Nút xác nhận thanh toán
        Button(
            onClick = { /* xử lý thanh toán */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .padding(horizontal = 32.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF66BB6A)),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text(
                text = "Xác nhận & Thanh toán",
                color = Color.White,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun InfoCard(title: String, lines: List<String>, color: Color) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .background(color.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
            .border(1.dp, Color(0xFFE0E0E0), RoundedCornerShape(12.dp))
            .padding(14.dp)
    ) {
        Column {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF4A148C))
            Spacer(modifier = Modifier.height(4.dp))
            for (line in lines) {
                Text(line, fontSize = 14.sp, color = Color.DarkGray)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewSanSuKienComfirmScreen() {
    SanSuKienComfirmScreen()
}
