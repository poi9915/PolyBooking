package com.poizz.polybooking.ui.screen.auth


import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.poizz.polybooking.R
import com.poizz.polybooking.ui.theme.PolyBookingTheme

@Composable
fun EditProfileScreen() {

    // Biến lưu dữ liệu nhập
    var name by remember { mutableStateOf("") }
//    var gender by remember { mutableStateOf("") }
    var birth by remember { mutableStateOf("") }
    var level by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("Nam") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFDFFFC8))
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
                    .clickable {  }
            )

            Text(
                text = "Quản lý tài khoản",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(),
                textAlign = TextAlign.Center
            )
        }

        // Nội dung form
        Column(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

//            Text(
//                text = "Cập nhật thông tin",
//                fontWeight = FontWeight.SemiBold,
//                fontSize = 16.sp,
//                color = Color.DarkGray,
//                modifier = Modifier.padding(bottom = 12.dp)
//            )
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
                    Icon(
                        painter = painterResource(id = R.drawable.baseline_edit_24),
                        contentDescription = "Edit",
                        tint = Color(0xFF4CAF50),
                        modifier = Modifier
                            .size(26.dp)
                            .offset(x = (-4).dp, y = (-4).dp)
                            .background(Color.White, CircleShape)
                            .padding(4.dp)
                    )
                }
            }

            // Các ô nhập
            InputField("Họ tên", name) { name = it }
            GenderSelectionRow(
                selectedGender = gender,
                onGenderSelected = { gender = it }
            )
            InputField("Ngày sinh", birth) { birth = it }
            InputField("Trình độ", level) { level = it }
            InputField("Số điện thoại", phone) { phone = it }
            InputField("Email", email) { email = it }
            InputField("Địa chỉ", address) { address = it }

            Spacer(modifier = Modifier.height(20.dp))

            // Nút hành động
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Button(
                    onClick = { /* TODO: Lưu dữ liệu */ },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8BC34A)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.width(120.dp)
                ) {
                    Text(text = "Cập nhật", color = Color.White, fontWeight = FontWeight.Bold)
                }

//                Button(
//                    onClick = {  },
//                    colors = ButtonDefaults.buttonColors(containerColor = Color.LightGray),
//                    shape = RoundedCornerShape(16.dp),
//                    modifier = Modifier.width(120.dp)
//                ) {
//                    Text(text = "Thoát", color = Color.Black, fontWeight = FontWeight.Bold)
//                }
            }
        }
    }
}

// 🧩 Component nhập dữ liệu
@Composable
fun InputField(label: String, value: String, onValueChange: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Text(
            text = label,
            fontSize = 13.sp,
            color = Color.Black,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(start = 4.dp, bottom = 4.dp)
        )
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFFAFAFA), shape = RoundedCornerShape(8.dp))
                .padding(horizontal = 12.dp, vertical = 10.dp),
            textStyle = androidx.compose.ui.text.TextStyle(color = Color.Black, fontSize = 14.sp)
        )
    }
}
@Composable
fun GenderSelectionRow(
    selectedGender: String,
    onGenderSelected: (String) -> Unit
) {
    val genders = listOf("Nam", "Nữ", "Khác")

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        // Label nhỏ trên đầu (giống các ô nhập)
        Text(
            text = "Giới tính",
            fontSize = 13.sp,
            color = Color.Black,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(start = 4.dp, bottom = 4.dp)
        )

        // Hàng lựa chọn với viền bo
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Color(0xFF8CD790), RoundedCornerShape(12.dp))
                .background(Color(0xFFFAFAFA), RoundedCornerShape(12.dp))
                ,
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            genders.forEach { gender ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clickable { onGenderSelected(gender) }
                        .padding(horizontal = 4.dp)
                ) {
                    RadioButton(
                        selected = (selectedGender == gender),
                        onClick = { onGenderSelected(gender) },
                        colors = RadioButtonDefaults.colors(
                            selectedColor = Color(0xFF6FC772),
                            unselectedColor = Color.Gray
                        )
                    )
                    Text(
                        text = gender,
                        color = if (selectedGender == gender) Color(0xFF388E3C) else Color.Black,
                        fontWeight = if (selectedGender == gender) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun PreviewUpdateAcount() {
    PolyBookingTheme {
        EditProfileScreen()
    }
}
