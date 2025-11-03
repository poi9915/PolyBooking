package com.example.ratingdialogdemo

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import kotlinx.coroutines.launch

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun RatingDialog(
    show: Boolean,
    onDismiss: () -> Unit,
    onConfirm: (Double) -> Unit,
    initialRating: Double = 0.0,
    // 🔹 Danh sách từ 2.0 đến 5.0
    options: List<Double> = List(31) { i -> 2.0 + i * 0.1 }
) {
    if (!show) return

    val focusManager = LocalFocusManager.current
    val keyboardController = LocalSoftwareKeyboardController.current
    var selected by remember { mutableStateOf(initialRating) }

    val gridState = rememberLazyGridState()
    val coroutineScope = rememberCoroutineScope()

    Dialog(onDismissRequest = {
        focusManager.clearFocus()
        keyboardController?.hide()
        onDismiss()
    }) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color.White,
            tonalElevation = 8.dp,
            modifier = Modifier
                .padding(16.dp)
                .wrapContentHeight()
                .widthIn(max = 360.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Tiêu đề
                Text(
                    text = "Chấm trình",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Trình mức Pickleball là cách đánh giá kỹ năng, " +
                            "dựa trên trình độ chuyên nghiệp (2.0 – 5.0). " +
                            "Hãy lựa chọn điểm phù hợp nhất nhé!",
                    style = MaterialTheme.typography.bodyMedium,
                    textAlign = TextAlign.Center,
                    color = Color.Gray
                )

                Spacer(modifier = Modifier.height(16.dp))

                // 🔹 Lưới cuộn được
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp) // Giới hạn chiều cao để cuộn
                ) {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(4),
                        state = gridState,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(options) { opt ->
                            val isSelected = selected == opt
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (isSelected) Color(0xFF1976D2) else Color(0xFFF1F1F1),
                                tonalElevation = if (isSelected) 4.dp else 0.dp,
                                modifier = Modifier
                                    .height(45.dp)
                                    .clickable {
                                        selected = opt
                                        coroutineScope.launch {
                                            gridState.animateScrollToItem(options.indexOf(opt))
                                        }
                                    }
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = String.format("%.1f", opt),
                                        color = if (isSelected) Color.White else Color.Black,
                                        style = MaterialTheme.typography.bodyLarge
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Nút xác nhận
                Button(
                    onClick = {
                        focusManager.clearFocus()
                        keyboardController?.hide()
                        onConfirm(selected)
                    },
                    enabled = selected != 0.0,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50)),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Text("Xác nhận", color = Color.White, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewRatingDialog() {
    var showDialog by remember { mutableStateOf(true) }

    MaterialTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF5F5F5)),
            contentAlignment = Alignment.Center
        ) {
            RatingDialog(
                show = showDialog,
                onDismiss = { showDialog = false },
                onConfirm = {
                    showDialog = false
                    println("Điểm đã chọn: $it")
                },
                initialRating = 3.5
            )
        }
    }
}
