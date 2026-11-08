# İstizan — Çevrimdışı Telefon Uygulaması

melihgulegen-ops/elih deposunda görülen görev, istizan ve not işlevleri React Native, Expo ve Expo Router ile telefon uygulamasına uyarlanmıştır. Orijinal web kodu veya Capacitor kullanılmaz. İmza: Melih Gülegen · MGN.

## Özellikler

- Genel bakiye, geçen aydan devreden tutar ve bu ayın bakiyesi.
- Görev ekleme, düzenleme, silme, tarih/saat, öncelik, plan ve tamamlanma durumu.
- Yatan, iade ve alınan malzeme kayıtları; kişi, tutar, malzeme, yer ve miktar alanları.
- Not ekleme, düzenleme, silme, arama ve ay filtresi.
- Cihazda PDF ve gerçek XLSX raporları oluşturma.
- Kalıcı yerel AsyncStorage saklama. İlk kurulumda kayıtlar boştur; örnek veya sahte veri yoktur.

Yatan ve iade tutarları bakiyeye eklenir, malzeme tutarları bakiyeden düşülür. Devreden bakiye mevcut aydan önceki kayıtların net toplamıdır. Rapor dönemi kayıtları filtreler; rapordaki genel bakiye tüm kayıtları kapsar.

## İnternetsiz kullanım

Kurulmuş Android uygulaması açılmak, kayıt saklamak ve rapor oluşturmak için internet, giriş veya sunucu gerektirmez. Uzaktan görsel, yazı tipi veya veri indirmez. OTA güncellemeleri kapalıdır. OnSpace önizlemesi ve uygulamayı derleme/indirme işlemleri internet gerektirir. Paylaşımda internet gerektiren bir uygulama seçilirse o uygulamanın bağlantı gereksinimi ayrıdır.

Veriler yalnızca uygulamanın cihazdaki alanında saklanır. Uygulamayı kaldırmak, uygulama verilerini temizlemek veya önizlemenin tarayıcı verilerini temizlemek kayıtları silebilir. Önizleme ve APK birbirinden ayrı depolama kullanır. PDF/Excel raporları otomatik geri yüklenebilir yedekler değildir.

## Android APK

Bu proje kaynak kodu ve APK derleme yapılandırması içerir; bu düzenleme oturumunda bir APK derlenmiş veya doğrulanmış değildir.

OnSpace sağ üst **Download** menüsünden **Android APK** seçeneğini kullanın. Derleme tamamlandığında APK'yı telefona indirip kurun. Telefon, gerektiğinde bu kaynaktan uygulama yükleme izni ister.

Kaynak kodu dışa aktarıp Expo EAS kullanmak için bağımlılıklar kurulduktan sonra:

```sh
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```

EAS hesabı, proje bağlantısı, Android imzalama ve derleme için internet gerekir. `preview` profili APK, `production` profili mağaza için AAB üretir. Mevcut OnSpace proje kimliği varsa korunur.

## Cihaz kontrol listesi

1. APK'yı kurun, uçak modunu açın ve uygulamayı başlatın.
2. Görev, istizan ve not ekleyip uygulamayı tamamen kapatın; yeniden açınca kayıtları kontrol edin.
3. Yatan 1000, iade 100 ve malzeme 250 eklediğinizde net bakiyenin 850 olduğunu kontrol edin.
4. Görev tamamlayın, kayıt düzenleyin, silme onayını deneyin ve filtreleri kontrol edin.
5. Uçak modunda PDF ve Excel raporlarını oluşturup cihazdaki paylaşım/kaydetme seçeneğini kontrol edin.
6. Küçük ekran ve yatay yönlendirmede giriş alanlarının ve klavyenin erişilebilirliğini kontrol edin.

## Mimari

`services/` veri ve rapor işlemleri, `contexts/` ortak kayıt durumu, `hooks/` iş mantığı, `components/` arayüz ve `app/` Expo Router sayfalarıdır.
