package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EventBookingScreen(
    onBackClick: () -> Unit = {},
    onCalendarClick: () -> Unit = {}
) {
    val suKienList = listOf(
        SuKien("Giải bóng đá giao hữu", "20/10/2025", "15:00 | Sân số 1", 25),
        SuKien("Giải cầu lông nội bộ", "22/10/2025", "08:30 | Sân số 3", 10),
        SuKien("Giải bóng chuyền nữ", "25/10/2025", "14:00 | Sân số 2", 40),
        SuKien("Giải tennis mở rộng", "28/10/2025", "09:00 | Sân số 5", 8),
        SuKien("Giải bóng bàn học viên", "30/10/2025", "10:00 | Sân số 4", 18)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Đặt sân sự kiện",
                            color = Color.White,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Quay lại",
                            tint = Color.White
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onCalendarClick) {
                        Icon(
                            imageVector = Icons.Default.CalendarMonth,
                            contentDescription = "Chọn ngày",
                            tint = Color.White
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF66BB6A), Color(0xFF43A047)))

        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFE9FFF8))
                .padding(innerPadding)
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            items(suKienList) { suKien ->
                SuKienCard(suKien)
            }
        }
    }
}

@Composable
fun SuKienCard(suKien: SuKien) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD)),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            Text(
                text = suKien.ten,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = Color(0xFF0D47A1)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = "📅 Ngày: ${suKien.ngay}", fontSize = 14.sp, color = Color.DarkGray)
            Text(text = "⏰ ${suKien.gioSan}", fontSize = 14.sp, color = Color.DarkGray)
            Text(
                text = "🎟️ Vé còn lại: ${suKien.soVe}",
                fontSize = 14.sp,
                color = if (suKien.soVe > 10) Color(0xFF2E7D32) else Color(0xFFD32F2F),
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(10.dp))

            // 🔹 Nút đặt sân
            Button(
                onClick = { /* TODO: Xử lý đặt sân */ },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(40.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50)),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Đặt sân", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

data class SuKien(
    val ten: String,
    val ngay: String,
    val gioSan: String,
    val soVe: Int
)

@Preview(showBackground = true)
@Composable
fun PreviewEventBookingScreen() {
    EventBookingScreen()
}
