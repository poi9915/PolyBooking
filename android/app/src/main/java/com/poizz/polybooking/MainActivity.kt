package com.poizz.polybooking

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.poizz.polybooking.ui.screen.MainApp
import com.poizz.polybooking.ui.theme.PolyBookingTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PolyBookingTheme {
                MainApp()
            }
        }
    }
}
<<<<<<< Updated upstream
=======

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
          text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    PolyBookingTheme {
        Greeting("Android")
    }
}
>>>>>>> Stashed changes
