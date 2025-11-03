package com.poizz.polybooking.ui.screen.auth

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun BookingScreen(
    onBack: () -> Unit = {},
    onContinue: (Set<Pair<String, String>>) -> Unit = {}
) {
    var selectedCells by remember { mutableStateOf(mutableSetOf<Pair<String, String>>()) }

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
                text = "Đặt sân thường",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 🔹 Thanh trạng thái
        Row(
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            StatusDot(Color(0xFFBDBDBD), "Trống")
            StatusDot(Color.Red, "Đã đặt")
            StatusDot(Color.Gray, "Khóa")
            StatusDot(Color.Magenta, "Đặt riêng")
        }

        Spacer(modifier = Modifier.height(12.dp))

        // 🔹 Lưới đặt sân (cuộn ngang)
        BookingGrid(
            selectedCells = selectedCells,
            onCellToggle = { cell ->
                if (selectedCells.contains(cell)) {
                    selectedCells.remove(cell)
                } else {
                    selectedCells.add(cell)
                }
                selectedCells = selectedCells.toMutableSet() // trigger recomposition
            }
        )

        Spacer(modifier = Modifier.height(24.dp))

        // 🔹 Nút tiếp tục
        Button(
            onClick = { onContinue(selectedCells) },
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF81C784)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .padding(horizontal = 40.dp)
        ) {
            Text("Tiếp tục", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

// 🟢 Thành phần trạng thái
@Composable
fun StatusDot(color: Color, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Canvas(
            modifier = Modifier
                .size(14.dp)
                .padding(end = 4.dp)
        ) {
            drawCircle(color = color)
        }
        Text(text = text, fontSize = 14.sp, color = Color.Black)
    }
}

// 🟢 Lưới hiển thị khung giờ đặt sân (cuộn ngang)
@Composable
fun BookingGrid(
    selectedCells: Set<Pair<String, String>>,
    onCellToggle: (Pair<String, String>) -> Unit
) {
    val days = listOf("Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN")
    val times = (7..22).map { "${it}:00" } // 7h → 22h
    val scrollState = rememberScrollState()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, Color.Gray.copy(alpha = 0.5f))
            .background(Color.White)
            .horizontalScroll(scrollState)
    ) {
        Column {
            // 🔹 Hàng tiêu đề giờ
            Row(
                modifier = Modifier
                    .background(Color(0xFFE0F2F1))
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.Start
            ) {
                Text("", modifier = Modifier.width(60.dp)) // ô đầu tiên trống
                times.forEach { time ->
                    Text(
                        text = time,
                        modifier = Modifier.width(60.dp),
                        textAlign = TextAlign.Center,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // 🔹 Các hàng tương ứng với ngày trong tuần
            days.forEach { day ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Start
                ) {
                    // Tên ngày
                    Text(
                        text = day,
                        modifier = Modifier
                            .width(60.dp)
                            .padding(4.dp),
                        textAlign = TextAlign.Center,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )

                    // Các ô giờ
                    times.forEach { time ->
                        val cell = Pair(day, time)
                        val isSelected = cell in selectedCells
                        val isBooked =
                            (day == "Thứ 3" && time == "18:00") || (day == "Thứ 7" && time == "9:00")

                        Box(
                            modifier = Modifier
                                .width(60.dp)
                                .height(40.dp)
                                .border(0.5.dp, Color.Gray.copy(alpha = 0.3f))
                                .background(
                                    when {
                                        isBooked -> Color.Red
                                        isSelected -> Color(0xFF8BC34A)
                                        else -> Color(0xFFF8FFF8)
                                    }
                                )
                                .clickable(enabled = !isBooked) { onCellToggle(cell) }
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SanThuongScreenPreview() {
    BookingScreen()
}
